import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { findModel, type ModelInfo } from '@/lib/models';
import type { WeatherData } from '@/lib/weather';
import { USAGE_MARKER, ERROR_MARKER, type Usage } from '@/lib/stream';

// Тук, на сървъра, превръщаме описанието от lib/models.ts в истински модел.
function createModel(info: ModelInfo) {
  switch (info.provider) {
    case 'anthropic':
      return anthropic(info.modelName);
    case 'google':
      return google(info.modelName);
  }
}

// Инструкциите са еднакви за всички модели, за да е честно сравнението.
const SYSTEM_PROMPT = `Ти си дружелюбен метеоролог.
Обясни прогнозата на български, на разбираем език, в 3–4 изречения.
Кажи как ще се усеща времето и дай един практичен съвет (облекло, чадър и т.н.).
Ползвай САМО числата от данните. Не измисляй стойности, които ги няма.
weatherCode е WMO код за типа време (0 = ясно, 61 = дъжд и т.н.).`;

export async function POST(request: Request) {
  // 1) Проверка на входа.
  const body = await request.json().catch(() => null);
  const modelInfo = body?.modelId ? findModel(body.modelId) : undefined;
  const weather: WeatherData | undefined = body?.weather;

  if (!modelInfo) {
    return Response.json({ error: 'Непознат модел' }, { status: 400 });
  }
  if (!weather?.current) {
    return Response.json({ error: 'Липсват данни за времето' }, { status: 400 });
  }

  // 2) Стартираме заявката към модела. streamText НЕ чака целия отговор,
  //    а връща резултат, от който четем частите, докато пристигат.
  const result = streamText({
    model: createModel(modelInfo),
    system: SYSTEM_PROMPT,
    prompt: `Данни за времето в JSON:\n${JSON.stringify(weather)}`,
    maxOutputTokens: 400, // таван, за да не стане отговорът (и цената) прекалено голям
    abortSignal: request.signal, // Без този ред моделът ще продължи да генерира текст, който никой не чете, а ти плащаш за него. С този ред генерирането спира веднага.
  });

  // 3) Строим собствен поток: първо текста, накрая статистиката.
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const part of result.fullStream) {
          if (part.type === 'text-delta') {
            controller.enqueue(encoder.encode(part.text));
          }
          if (part.type === 'error') {
            throw part.error;
          }
        }

        const usage = await result.usage;
        const summary: Usage = {
          inputTokens: usage.inputTokens ?? 0,
          outputTokens: usage.outputTokens ?? 0,
        };
        controller.enqueue(encoder.encode(USAGE_MARKER + JSON.stringify(summary)));
      } catch (error) {
        // Например: моделът е претоварен. Клиентът ще покаже съобщението в колоната.
        const message = error instanceof Error ? error.message : 'Неизвестна грешка';
        controller.enqueue(encoder.encode(ERROR_MARKER + message));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}