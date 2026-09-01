// Shared low-level Groq chat-completion caller. AI features built on top of
// this (api/ai/concierge/route.ts, councilWatch/summarize.ts) are
// responsible for their own grounding discipline — this function itself
// has no opinion on prompts, just the HTTP call.
export async function callGroq(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  jsonMode: boolean
): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 500,
      messages,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Groq request failed (${response.status})`);
  }
  const result = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return result.choices?.[0]?.message?.content ?? "";
}
