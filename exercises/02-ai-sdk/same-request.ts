import 'dotenv/config';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

const prompt = 'Обясни с 2 изречения какво е LLM.';

const models = [
  { name: 'Claude Haiku', model: anthropic('claude-haiku-4-5') },
  { name: 'Gemini Flash', model: google('gemini-3.8-flash') },
];

for (const { name, model } of models) {
  const start = performance.now();
  const { text, usage } = await generateText({ model, prompt });

  console.log(`\n=== ${name} ===`);
  console.log('Текст:', text);
  console.log('Токени:', usage);
  console.log('Време:', Math.round(performance.now() - start), 'ms');
}