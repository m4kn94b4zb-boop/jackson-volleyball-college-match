export async function generateRecruitingEmail({
  playerProfile,
  schoolProfile,
  emailType = "intro",
  tone = "confident, respectful, natural, not robotic",
  includeWebResearch = true,
}) {
  const response = await fetch("/api/generate-recruiting-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerProfile,
      schoolProfile,
      emailType,
      tone,
      includeWebResearch,
    }),
  });

  const rawText = await response.text();
  let data;

  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(
      `The API did not return JSON. Status: ${response.status}. Response starts with: ${rawText.slice(0, 300)}`
    );
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate recruiting email.");
  }

  return {
    subject: data.subject || "",
    body: data.body || "",
    personalizationScore: data.personalizationScore || 0,
    personalizationLevel: data.personalizationLevel || "Low",
    personalDetailsUsed: Array.isArray(data.personalDetailsUsed) ? data.personalDetailsUsed : [],
    programDetailsUsed: Array.isArray(data.programDetailsUsed) ? data.programDetailsUsed : [],
    whyThisIsPersonal: data.whyThisIsPersonal || "",
    editSuggestions: Array.isArray(data.editSuggestions) ? data.editSuggestions : [],
    warnings: Array.isArray(data.warnings) ? data.warnings : [],
  };
}
