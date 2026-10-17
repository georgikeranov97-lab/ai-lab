import 'dotenv/config';

const start = performance.now();

const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ANTHROPIC_API_KEY!,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-haiku-4-5',
    max_tokens: 300,
    messages: [{ role: 'user', content: 'Обясни с 2 изречения какво е LLM.' }],
  }),
});

const data = await res.json();
if (!res.ok) {
  console.error(res.status, data);
  process.exit(1);
}

console.log('Текст:', data.content[0].text);
console.log('Токени:', data.usage);
console.log('Време:', Math.round(performance.now() - start), 'ms');