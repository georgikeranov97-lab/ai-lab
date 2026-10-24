'use client';

import { useEffect, useState } from 'react';
import type { ModelInfo } from '@/lib/models';
import type { WeatherData } from '@/lib/weather';
import { USAGE_MARKER, ERROR_MARKER, type Usage } from '@/lib/stream';
import { calculateCost, formatCost } from '@/lib/cost';

type Status = 'idle' | 'streaming' | 'done' | 'error';

type Props = {
  model: ModelInfo;
  weather: WeatherData | null;
};

export function ModelColumn({ model, weather }: Props) {
  const [status, setStatus] = useState<Status>(weather ? 'streaming' : 'idle');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [firstTokenMs, setFirstTokenMs] = useState<number | null>(null);
  const [totalMs, setTotalMs] = useState<number | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    if (!weather) return;

    const controller = new AbortController();
    const start = performance.now();

    async function run() {
      try {
        const res = await fetch('/api/explain', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ modelId: model.id, weather }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? `HTTP ${res.status}`);
        }

        // Четем отговора на части, докато пристигат.
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read(); //Всяко reader.read() връща следващата пристигнала част.
          if (done) break;

          // Първата част = времето до първия токен (TTFT).
          if (buffer === '') {
            setFirstTokenMs(Math.round(performance.now() - start));
          }

          buffer += decoder.decode(value, { stream: true });

          // Показваме само текста, без служебните маркери в края.
          setText(buffer.split(USAGE_MARKER)[0].split(ERROR_MARKER)[0]);
        }

        setTotalMs(Math.round(performance.now() - start));

        if (buffer.includes(ERROR_MARKER)) {
          setError(buffer.split(ERROR_MARKER)[1]);
          setStatus('error');
          return;
        }

        const usagePart = buffer.split(USAGE_MARKER)[1];
        if (usagePart) setUsage(JSON.parse(usagePart));
        setStatus('done');
      } catch (err) {
        if (controller.signal.aborted) return; // прекъснато от нас, не е грешка
        setError(err instanceof Error ? err.message : 'Неизвестна грешка');
        setStatus('error');
      }
    }

    run();
    return () => controller.abort();
  }, [model.id, weather]);

  const cost = usage
    ? calculateCost(model, usage.inputTokens, usage.outputTokens)
    : null;

  const statusLabel: Record<Status, string> = {
    idle: 'Чака',
    streaming: 'Пише…',
    done: 'Готово',
    error: 'Грешка',
  };

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">{model.label}</h2>
        <span className="text-xs text-zinc-500">{statusLabel[status]}</span>
      </div>

      <div className="min-h-40 flex-1 whitespace-pre-wrap text-sm leading-relaxed">
        {text || (status === 'streaming' ? 'Чакам първия токен…' : '')}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">⚠️ {error}</p>}

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-zinc-800">
        <dt>До първия токен</dt>
        <dd className="text-right">{firstTokenMs != null ? `${firstTokenMs} ms` : '—'}</dd>
        <dt>Общо време</dt>
        <dd className="text-right">{totalMs != null ? `${totalMs} ms` : '—'}</dd>
        <dt>Токени (вход / изход)</dt>
        <dd className="text-right">
          {usage ? `${usage.inputTokens} / ${usage.outputTokens}` : '—'}
        </dd>
        <dt>Цена</dt>
        <dd className="text-right">{cost != null ? formatCost(cost) : '—'}</dd>
      </dl>
    </div>
  );
}