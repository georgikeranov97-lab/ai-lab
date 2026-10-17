import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

const prompt = 'Обясни на дете на 10 години защо небето е синьо.';

// Цени в $ за 1 милион токена — попълни от страниците Pricing
const models = [
  { name: 'Claude Haiku', model: anthropic('claude-haiku-4-5'), inputPrice: 1.00, outputPrice: 5.00 },
  { name: 'Claude Sonnet', model: anthropic('claude-sonnet-5-5'), inputPrice: 2.00, outputPrice: 10.00 },
  { name: 'Gemini Flash', model: google('gemini-3.8-flash'), inputPrice: 2.00, outputPrice: 10.00 },
];

const rows = ['model,input_tokens,output_tokens,cost_usd,time_ms,answer'];

for (const m of models) {
  try {
    const start = performance.now();
    const { text, usage } = await generateText({ model: m.model, prompt });
    const timeMs = Math.round(performance.now() - start);

    const input = usage.inputTokens ?? 0;
    const output = usage.outputTokens ?? 0;
    const cost = (input * m.inputPrice + output * m.outputPrice) / 1_000_000;

    // Махаме новите редове и удвояваме кавичките, за да не се счупи CSV-то
    const safeText = text.replace(/\n/g, ' ').replace(/"/g, '""');

    rows.push(`${m.name},${input},${output},${cost.toFixed(6)},${timeMs},"${safeText}"`);
    console.log(`✓ ${m.name}: ${timeMs} ms, $${cost.toFixed(6)}`);
  } catch (error) {
    console.log(`✗ ${m.name}: ${(error as Error).message}`);
  }
}

writeFileSync('results.csv', rows.join('\n'));
console.log('\nЗаписано в results.csv');