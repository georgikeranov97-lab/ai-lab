import 'dotenv/config';
import { generateText, type ModelMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const messages: ModelMessage[] = [];
const questions = [
  'Кой е най-високият връх в Испания?',
  'А колко е висок?',
  'Кога е най-подходящо да се изкача там?',
];

for (const question of questions) {
  messages.push({ role: 'user', content: question });

  const { text, usage } = await generateText({
    model: anthropic('claude-haiku-4-5'),
    messages,
  });

  messages.push({ role: 'assistant', content: text });
  console.log(`\nВъпрос: ${question}`);
  console.log(`Входни токени: ${usage.inputTokens}`);
}