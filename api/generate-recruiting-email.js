import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function safeString(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

function buildFallbackEmail({ playerProfile, schoolProfile }) {
  const playerName = safeString(playerProfile?.name, "[Your Name]");
  const gradYear = safeString(playerProfile?.gradYear, "[Grad Year]");
  const position = safeString(playerProfile?.position, "[Position]");
  const schoolName = safeString(schoolProfile?.schoolName, "[College Name]");
  const coachName = safeString(schoolProfile?.coachName, "Coach");
  const height = safeString(playerProfile?.height, "[Height]");
  const vertical = safeString(playerProfile?.vertical, "[Vertical]");
  const gpa = safeString(playerProfile?.gpa, "[GPA]");
  const highlightLink = safeString(playerProfile?.highlightLink, "[Highlight Link]");

  return {
    subject: `${gradYear} ${position} Interested in ${schoolName} Volleyball`,
    body: `Hi ${coachName},

My name is ${playerName}, and I am a ${gradYear} ${position}. I wanted to reach out because I am interested in ${schoolName} and would love to learn more about your volleyball program.

A few quick details about me:
Position: ${position}
Height: ${height}
Vertical: ${vertical}
GPA: ${gpa}
Highlight video: ${highlightLink}

I would appreciate the opportunity to stay in contact and learn what you look for in recruits.

Thank you for your time,

${playerName}`,
    personalizationScore: 35,
    personalizationLevel: "Low",
    personalDetailsUsed: [
      "Player name",
      "Graduation year",
      "Position",
      "Height",
      "Vertical",
      "GPA",
      "Highlight link",
    ],
    programDetailsUsed: ["School name"],
    whyThisIsPersonal:
      "This fallback email uses basic player and school information, but it does not include AI web research.",
    editSuggestions: [
      "Add one specific reason you like the school.",
      "Add one specific thing you noticed about the volleyball program.",
      "Add your upcoming tournament schedule if you want the coach to watch you.",
    ],
    warnings: [
      "AI generation was unavailable, so a safe fallback email was created instead.",
    ],
  };
}

function extractJson(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    // Keep going.
  }

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
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY. Add it in Vercel Environment Variables.",
      });
    }

    const {
      playerProfile = {},
      schoolProfile = {},
      emailType = "intro",
      tone = "confident, respectful, natural, not robotic",
      includeWebResearch = true,
    } = req.body || {};

    const playerName = safeString(playerProfile.name);
    const gradYear = safeString(playerProfile.gradYear);
    const position = safeString(playerProfile.position);
    const schoolName = safeString(schoolProfile.schoolName);

    if (!playerName || !gradYear || !position) {
      return res.status(400).json({
        error:
          "Missing required player info. Please include name, gradYear, and position.",
      });
    }

    if (!schoolName) {
      return res.status(400).json({
        error: "Missing required school info. Please include schoolName.",
      });
    }

    const instructions = `
You are a college volleyball recruiting email assistant.

Your job:
Create a highly personalized recruiting email preview for a high school boys volleyball player.

Important rules:
- Do not send the email.
- Do not claim the player has offers, awards, stats, achievements, or relationships unless they are provided.
- Do not invent fake coach names, fake conversations, fake campus visits, fake match attendance, or fake personal connections.
- If web research is available, use it carefully and only mention details you are confident about.
- If you are unsure about a program detail, phrase it carefully.
- Make the email sound like a motivated high school student-athlete, not a business robot.
- Keep the email clear and not too long.
- Include the player's vertical if provided.
- Include academics if provided.
- Include coach references if provided.
- Include highlight video if provided.
- Include upcoming tournament schedule if provided.
- Return only valid JSON.
`;

    const userPrompt = `
Create a high-personalization recruiting email.

Email type:
${emailType}

Tone:
${tone}

Player profile:
${JSON.stringify(playerProfile, null, 2)}

School/program profile:
${JSON.stringify(schoolProfile, null, 2)}

Return exactly this JSON format:
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
}
`;

    const response = await client.responses.create({
      model: "gpt-5.2",
      instructions,
      input: userPrompt,
      tools: includeWebResearch
        ? [
            {
              type: "web_search_preview",
            },
          ]
        : [],
    });

    const text = response.output_text || "";
    const parsed = extractJson(text);

    if (!parsed) {
      return res.status(200).json({
        subject: `${gradYear} ${position} Interested in ${schoolName} Volleyball`,
        body: text,
        personalizationScore: 70,
        personalizationLevel: "Medium",
        personalDetailsUsed: ["Player profile information"],
        programDetailsUsed: ["School/program information"],
        whyThisIsPersonal:
          "The email was generated using the player's profile and selected school information.",
        editSuggestions: [
          "Review the email before sending.",
          "Add a more specific reason you like the school if needed.",
        ],
        warnings: [
          "The AI response was not perfect JSON, so the app converted it into a preview.",
        ],
      });
    }

    const finalEmail = {
      subject:
        safeString(parsed.subject) ||
        `${gradYear} ${position} Interested in ${schoolName} Volleyball`,
      body: safeString(parsed.body),
      personalizationScore:
        typeof parsed.personalizationScore === "number"
          ? parsed.personalizationScore
          : 75,
      personalizationLevel:
        parsed.personalizationLevel === "High" ||
        parsed.personalizationLevel === "Medium" ||
        parsed.personalizationLevel === "Low"
          ? parsed.personalizationLevel
          : "Medium",
      personalDetailsUsed: Array.isArray(parsed.personalDetailsUsed)
        ? parsed.personalDetailsUsed
        : [],
      programDetailsUsed: Array.isArray(parsed.programDetailsUsed)
        ? parsed.programDetailsUsed
        : [],
      whyThisIsPersonal: safeString(parsed.whyThisIsPersonal),
      editSuggestions: Array.isArray(parsed.editSuggestions)
        ? parsed.editSuggestions
        : [],
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    };

    return res.status(200).json(finalEmail);
  } catch (error) {
    console.error("generate-recruiting-email error:", error);

    const fallback = buildFallbackEmail({
      playerProfile: req.body?.playerProfile || {},
      schoolProfile: req.body?.schoolProfile || {},
    });

    return res.status(200).json(fallback);
  }
}