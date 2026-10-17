# 01 – Директни извиквания към API (без SDK)

**Модул 1, седмица 1 · Упражнение 1**
**Дата:** ____________

## Цел

Да извикам REST API-тата на Anthropic и Google директно с `fetch`, без AI SDK, и да видя как се различават форматите на заявките и отговорите.

## Как се пуска

```bash
pnpm tsx anthropic.ts
pnpm tsx google.ts
```

Нужен е файл `.env` с `ANTHROPIC_API_KEY` и `GOOGLE_GENERATIVE_AI_API_KEY`.

## Резултати

Prompt: „Обясни с 2 изречения какво е LLM.“

| | Anthropic | Google |
| --- | --- | --- |
| Модел | Claude | ____________ |
| Входни токени | 25 | ____ |
| Изходни токени | 129 | ____ |
| Време (ms) | 3029 | ____ |

## Разлики между двата API-а

| | Anthropic | Google |
| --- | --- | --- |
| Как се подава ключът | x-api-key| x-goog-api-key |
| Къде се посочва моделът | in the request body | in the URL |
| Формат на съобщенията | messages with content key | content object with parts key |
| Къде е текстът в отговора | data.content[0].text | ____________ |
| Как се казват полетата за токени | Tokens: {
  input_tokens: 25,
  cache_creation_input_tokens: 0,
  cache_read_input_tokens: 0,
  cache_creation: { ephemeral_5m_input_tokens: 0, ephemeral_1h_input_tokens: 0 },
  output_tokens: 129,
  service_tier: 'standard',
  inference_geo: 'not_available'
} | ____________ |

## Изводи

Anthropic is more reliable as the Gemini often returns me high demand error

____________________________________________

## Проблеми, на които попаднах

Gemini often returns me a high demand error:
503 {
  error: {
    code: 503,
    message: 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.',
    status: 'UNAVAILABLE'
  }
}

- ____________________________________________