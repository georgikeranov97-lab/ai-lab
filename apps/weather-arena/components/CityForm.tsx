'use client';

import { useState } from 'react';

type Props = {
  onSubmit: (city: string) => void;
  loading: boolean;
};

export function CityForm({ onSubmit, loading }: Props) {
  const [city, setCity] = useState('Мадрид');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (city.trim()) onSubmit(city.trim());
      }}
      className="flex gap-2"
    >
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Въведи град"
        className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Зареждам…' : 'Сравни'}
      </button>
    </form>
  );
}