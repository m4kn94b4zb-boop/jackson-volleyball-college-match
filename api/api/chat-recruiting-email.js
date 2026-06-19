import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {}
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY in Vercel Environment Variables." });
    }

    const { playerProfile = {}, schoolProfile = {}, currentDraft = {}, userMessage = "", chatHistory = [] } = req.body || {};

    const prompt = `
You are helping revise a men's college volleyball recruiting email.

Player profile:
${JSON.stringify(playerProfile, null, 2)}

School profile:
${JSON.stringify(schoolProfile, null, 2)}

Current draft:
${JSON.stringify(currentDraft, null, 2)}

Chat history:
${JSON.stringify(chatHistory, null, 2)}

User message:
${userMessage}

Rules:
- If the user asks to change the email, return an updated subject/body.
- If the user asks a question, answer it and only change the draft if helpful.
- Do not invent fake achievements, offers, coach relationships, or visits.
- Return only valid JSON.

Return exactly:
{
  "reply": "string",
  "subject": "string",
  "body": "string",
  "editSuggestions": ["string"],
  "whyThisIsPersonal": "string",
  "changeSummary": "string"
}
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const parsed = extractJson(response.output_text || "");
    if (!parsed) {
      return res.status(200).json({
        reply: "I could not fully update the draft, but you can ask again with a simpler request.",
        subject: currentDraft.subject || "",
        body: currentDraft.body || "",
        editSuggestions: [],
        whyThisIsPersonal: "",
        changeSummary: "No draft changes were made.",
      });
    }

    return res.status(200).json({
      reply: parsed.reply || parsed.changeSummary || "I updated the draft.",
      subject: parsed.subject || currentDraft.subject || "",
      body: parsed.body || currentDraft.body || "",
      editSuggestions: Array.isArray(parsed.editSuggestions) ? parsed.editSuggestions : [],
      whyThisIsPersonal: parsed.whyThisIsPersonal || "",
      changeSummary: parsed.changeSummary || "",
    });
  } catch (error) {
    console.error("chat-recruiting-email error:", error);
    return res.status(500).json({ error: error.message || "Failed to chat about the recruiting email." });
  }
}
