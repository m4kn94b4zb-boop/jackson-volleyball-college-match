import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function safeString(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

function extractJson(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    // Continue and try to pull JSON out of surrounding text.
  }

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function fallbackResponse({ currentDraft, userMessage }) {
  return {
    reply:
      'I could not reach the AI editor right now, so I left the draft unchanged. Your request was: ' +
      safeString(userMessage, 'No request provided.'),
    subject: currentDraft?.subject || '',
    body: currentDraft?.body || '',
    changeSummary: 'No AI changes were made because the chat request failed.',
    whyThisIsPersonal: '',
    editSuggestions: [
      'Try again after checking your Vercel logs and OPENAI_API_KEY.',
      'You can still edit the subject and body manually before copying.',
    ],
    warnings: ['AI chat fallback was used.'],
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed. Use POST.',
    });
  }

  const {
    playerProfile = {},
    schoolProfile = {},
    currentDraft = {},
    userMessage = '',
    chatHistory = [],
  } = req.body || {};

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json(fallbackResponse({ currentDraft, userMessage }));
    }

    if (!safeString(userMessage)) {
      return res.status(400).json({ error: 'Missing userMessage.' });
    }

    const prompt = `
You are an AI editor inside a volleyball recruiting app.

The user is a high school boys volleyball player editing a coach recruiting email.

Your job:
- Answer the user's question about the email.
- If the user asks for a change, rewrite the draft.
- Keep the email respectful, confident, simple, and realistic.
- Make it sound like a motivated high school athlete, not a corporate adult.
- Use the player's saved notes when helpful.
- Do not invent fake awards, stats, offers, visits, coach conversations, or personal connections.
- Never send the email. Only edit the draft.

Player profile:
${JSON.stringify(playerProfile, null, 2)}

School/program profile:
${JSON.stringify(schoolProfile, null, 2)}

Current draft:
${JSON.stringify(currentDraft, null, 2)}

Recent chat history:
${JSON.stringify(chatHistory, null, 2)}

User message:
${userMessage}

Return only valid JSON with this exact shape:
{
  "reply": "short message explaining what you changed or answering the question",
  "subject": "updated subject line",
  "body": "updated email body",
  "changeSummary": "brief summary of changes",
  "whyThisIsPersonal": "why the new draft is more personal",
  "editSuggestions": ["suggestion"],
  "warnings": ["warning"]
}
`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: prompt,
    });

    const text = response.output_text || '';
    const parsed = extractJson(text);

    if (!parsed) {
      return res.status(200).json({
        reply: text || 'I reviewed the draft, but the response could not be converted into structured edits.',
        subject: currentDraft.subject || '',
        body: currentDraft.body || '',
        changeSummary: 'No structured draft update was made.',
        whyThisIsPersonal: '',
        editSuggestions: ['Review the draft manually and try a shorter chat request.'],
        warnings: ['AI returned unstructured text.'],
      });
    }

    return res.status(200).json({
      reply: safeString(parsed.reply, 'I updated the draft.'),
      subject: safeString(parsed.subject, currentDraft.subject || ''),
      body: safeString(parsed.body, currentDraft.body || ''),
      changeSummary: safeString(parsed.changeSummary),
      whyThisIsPersonal: safeString(parsed.whyThisIsPersonal),
      editSuggestions: Array.isArray(parsed.editSuggestions) ? parsed.editSuggestions : [],
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    });
  } catch (error) {
    console.error('chat-recruiting-email error:', error);
    return res.status(200).json(fallbackResponse({ currentDraft, userMessage }));
  }
}
