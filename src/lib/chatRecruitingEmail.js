export async function chatRecruitingEmail({
  playerProfile,
  schoolProfile,
  currentEmail,
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
      currentEmail,
      userMessage,
      chatHistory,
    }),
  });

  const rawText = await response.text();

  let data;

  try {
    data = JSON.parse(rawText);
  } catch {
    const preview = rawText.slice(0, 300);
    throw new Error(
      `The chat API did not return JSON. Status: ${response.status}. Response starts with: ${preview}`
    );
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to chat about the recruiting email.");
  }

  return {
    reply: data.reply || "",
    updatedSubject: data.updatedSubject || currentEmail?.subject || "",
    updatedBody: data.updatedBody || currentEmail?.body || "",
    suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
  };
}
