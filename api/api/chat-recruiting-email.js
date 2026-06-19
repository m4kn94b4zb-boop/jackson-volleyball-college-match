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
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY in Vercel Environment Variables.",
      });
    }

    const {
      playerProfile = {},
      schoolProfile = {},
      currentDraft = {},
      userMessage = "",
      chatHistory = [],
    } = req.body || {};

    const messages = [
      {
        role: "system",
        content:
          "You help revise men's college volleyball recruiting emails. Do not invent fake achievements, offers, awards, coach conversations, or visits. Return only valid JSON.",
      },
      {
        role: "user",
        content: `Player profile:
${JSON.stringify(playerProfile, null, 2)}

School profile:
${JSON.stringify(schoolProfile, null, 2)}

Current draft:
${JSON.stringify(currentDraft, null, 2)}

Chat history:
${JSON.stringify(chatHistory, null, 2)}

User message:
${userMessage}

Return exactly this JSON shape:
{
  "reply": "string",
  "subject": "string",
  "body": "string",
  "editSuggestions": ["string"],
  "whyThisIsPersonal": "string",
  "changeSummary": "string"
}`,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.5,
    });

    const text = completion.choices?.[0]?.message?.content || "";
    const parsed = extractJson(text);

    if (!parsed) {
      return res.status(200).json({
        reply:
          "I could not fully update the draft, but you can ask again with a simpler request.",
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
      editSuggestions: Array.isArray(parsed.editSuggestions)
        ? parsed.editSuggestions
        : [],
      whyThisIsPersonal: parsed.whyThisIsPersonal || "",
      changeSummary: parsed.changeSummary || "",
    });
  } catch (error) {
    console.error("chat-recruiting-email error:", error);
    return res.status(500).json({
      error: error.message || "Failed to chat about the recruiting email.",
    });
  }
}
