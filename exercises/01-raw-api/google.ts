import 'dotenv/config';

const model = 'gemini-3.8-flash';
const start = performance.now();

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  {
    method: 'POST',
    headers: {
      'x-goog-api-key': process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: 'Обясни с 2 изречения какво е LLM.' }] }],
    }),
  },
);

const data = await res.json();
if (!res.ok) {
  console.error(res.status, data);
  process.exit(1);
}

console.log('Текст:', data.candidates[0].content.parts[0].text);
console.log('Токени:', data.usageMetadata);
console.log('Време:', Math.round(performance.now() - start), 'ms');