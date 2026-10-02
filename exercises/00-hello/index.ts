import 'dotenv/config';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

const prompt = 'Обясни с 2 изречения какво е LLM.';

let result;
try {
  result = await generateText({ model: google('gemini-3.8-flash'), prompt });
  console.log('Отговор от Gemini');
} catch (error) {
  console.log('Gemini не отговори, минавам към Claude...', (error as Error).message);
  result = await generateText({ model: anthropic('claude-haiku-4-5'), prompt });
}

console.log(result.text);
console.log(result.usage);