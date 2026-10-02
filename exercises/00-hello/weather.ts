import 'dotenv/config';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const url =
  'https://api.open-meteo.com/v1/forecast?latitude=42.70&longitude=23.32&current=temperature_2m,wind_speed_10m';

const weather = await fetch(url).then((res) => res.json());

const { text } = await generateText({
  model: anthropic('claude-haiku-4-5'),
  prompt: `Ето данни за времето в София в JSON:
${JSON.stringify(weather)}

Обясни ги с 2 изречения на български и дай съвет как да се облека.`,
});

console.log(text);