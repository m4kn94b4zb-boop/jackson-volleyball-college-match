export async function chatRecruitingEmail({
  playerProfile,
  schoolProfile,
  currentDraft,
  userMessage,
  chatHistory = [],
}) {
  const response = await fetch('/api/chat-recruiting-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
    throw new Error(`The chat API did not return JSON. Status: ${response.status}. Response starts with: ${rawText.slice(0, 250)}`);
  }

  if (!response.ok) {
    throw new Error(data.error || 'Failed to chat about the recruiting email.');
  }

  return {
    reply: data.reply || '',
    subject: data.subject || currentDraft?.subject || '',
    body: data.body || currentDraft?.body || '',
    changeSummary: data.changeSummary || '',
    whyThisIsPersonal: data.whyThisIsPersonal || '',
    editSuggestions: Array.isArray(data.editSuggestions) ? data.editSuggestions : [],
    warnings: Array.isArray(data.warnings) ? data.warnings : [],
  };
}
