export async function chatRecruitingEmail({
  playerProfile,
  schoolProfile,
  currentDraft,
  userMessage,
  chatHistory = [],
}) {
  const response = await fetch("/api/chat-recruiting-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerProfile,
      schoolProfile,
      currentDraft,
      userMessage,
      chatHistory,
    }),
  });

  const rawText = await response.text();
  let data;

  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(
      `The chat API did not return JSON. Status: ${response.status}. Response starts with: ${rawText.slice(0, 300)}`
    );
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to chat about the recruiting email.");
  }

  return {
    reply: data.reply || "",
    subject: data.subject || data.updatedSubject || currentDraft?.subject || "",
    body: data.body || data.updatedBody || currentDraft?.body || "",
    editSuggestions: Array.isArray(data.editSuggestions) ? data.editSuggestions : [],
    whyThisIsPersonal: data.whyThisIsPersonal || "",
    changeSummary: data.changeSummary || "",
  };
}
