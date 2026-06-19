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

function fallback(playerProfile = {}, schoolProfile = {}) {
  const name = playerProfile.name || "Jackson DeMarco";
  const gradYear = playerProfile.gradYear || "[Grad Year]";
  const position = playerProfile.position || "[Position]";
  const school = schoolProfile.schoolName || "[College]";
  const notes = playerProfile.playerNotes
    ? `\n\nA little more about me:\n${playerProfile.playerNotes}`
    : "";

  return {
    subject: `${gradYear} ${position} Interested in ${school} Men's Volleyball`,
    body: `Hi Coach,

My name is ${name}, and I am a ${gradYear} ${position}. I wanted to reach out because I am interested in ${school} men's volleyball.

A few quick details about me:
Position: ${position}
Height: ${playerProfile.height || "[Height]"}
Vertical: ${playerProfile.vertical || "[Vertical]"}
GPA: ${playerProfile.gpa || "[GPA]"}
Highlight video: ${playerProfile.highlightLink || "[Highlight Link]"}${notes}

I would appreciate the opportunity to stay in contact and learn what you look for in recruits.

Thank you for your time,

${name}`,
    personalizationScore: 35,
    personalizationLevel: "Low",
    personalDetailsUsed: ["Saved player profile", "Player notes"],
    programDetailsUsed: ["School name"],
    whyThisIsPersonal: "This is the fallback draft. The AI route is working enough to return a draft, but it did not generate a full AI JSON response.",
    editSuggestions: ["Add one specific reason you like the program before sending."],
    warnings: ["Fallback draft used."],
  };
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
      emailType = "intro",
      tone = "confident, respectful, natural, motivated, not robotic",
    } = req.body || {};

    const messages = [
      {
        role: "system",
        content:
          "You create realistic men's college volleyball recruiting emails. Do not invent fake achievements, offers, awards, coach conversations, or visits. Return only valid JSON.",
      },
      {
        role: "user",
        content: `Create a recruiting email preview.

Tone: ${tone}
Email type: ${emailType}

Player profile:
${JSON.stringify(playerProfile, null, 2)}

School/program profile:
${JSON.stringify(schoolProfile, null, 2)}

Return exactly this JSON shape:
{
  "subject": "string",
  "body": "string",
  "personalizationScore": number,
  "personalizationLevel": "Low" | "Medium" | "High",
  "personalDetailsUsed": ["string"],
  "programDetailsUsed": ["string"],
  "whyThisIsPersonal": "string",
  "editSuggestions": ["string"],
  "warnings": ["string"]
}`,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.6,
    });

    const text = completion.choices?.[0]?.message?.content || "";
    const parsed = extractJson(text);

    if (!parsed) {
      return res.status(200).json(fallback(playerProfile, schoolProfile));
    }

    return res.status(200).json({
      subject:
        parsed.subject ||
        `${playerProfile.gradYear || ""} ${playerProfile.position || ""} Interested in ${schoolProfile.schoolName || "Your Program"}`,
      body: parsed.body || "",
      personalizationScore:
        typeof parsed.personalizationScore === "number"
          ? parsed.personalizationScore
          : 75,
      personalizationLevel: ["Low", "Medium", "High"].includes(
        parsed.personalizationLevel
      )
        ? parsed.personalizationLevel
        : "Medium",
      personalDetailsUsed: Array.isArray(parsed.personalDetailsUsed)
        ? parsed.personalDetailsUsed
        : [],
      programDetailsUsed: Array.isArray(parsed.programDetailsUsed)
        ? parsed.programDetailsUsed
        : [],
      whyThisIsPersonal: parsed.whyThisIsPersonal || "",
      editSuggestions: Array.isArray(parsed.editSuggestions)
        ? parsed.editSuggestions
        : [],
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    });
  } catch (error) {
    console.error("generate-recruiting-email error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate recruiting email.",
    });
  }
}
