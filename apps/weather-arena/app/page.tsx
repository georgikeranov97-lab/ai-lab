'use client';

import { useState } from 'react';
import { CityForm } from '@/components/CityForm';
import { ModelColumn } from '@/components/ModelColumn';
import { MODELS } from '@/lib/models';
import type { WeatherData } from '@/lib/weather';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [runId, setRunId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(city: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWeather(data);
      setRunId((id) => id + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестна грешка');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Weather Explainer Arena</h1>
      <p className="mt-2 text-zinc-500">
        Една прогноза, три модела. Сравни качество, скорост и цена.
      </p>

      <div className="mt-6">
        <CityForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {weather && (
        <p className="mt-4 text-sm text-zinc-500">
          {weather.city.name}, {weather.city.country}: {weather.current.temperature}°C,
          усеща се като {weather.current.feelsLike}°C
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {MODELS.map((model) => (
          <ModelColumn
            key={`${model.id}-${runId}`}
            model={model}
            weather={weather}
          />
        ))}
      </div>
    </main>
  );
}