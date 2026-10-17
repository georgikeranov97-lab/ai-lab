import 'dotenv/config';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const prompt = 'Измисли име за малко кафене в Мадрид. Отговори само с името.';

for (const temperature of [0, 0.7, 1]) {
  const answers: string[] = [];

  for (let i = 0; i < 10; i++) {
    const { text } = await generateText({
      model: anthropic('claude-haiku-4-5'),
      prompt,
      temperature,
    });
    answers.push(text.trim());
  }

  const unique = new Set(answers);
  console.log(`\n=== temperature ${temperature}: ${unique.size} различни от 10 ===`);
  console.log([...unique].join('\n'));
}