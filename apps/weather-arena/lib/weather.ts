// Работата е на две стъпки:
// 1) от името на града намираме координатите (geocoding API)
// 2) с координатите взимаме прогнозата (forecast API)
// И двете API-та са безплатни и без ключ.

export type City = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type WeatherData = {
  city: City;
  current: {
    temperature: number;         // °C
    feelsLike: number;           // °C, усеща се като
    humidity: number;            // %
    precipitation: number;       // mm
    windSpeed: number;           // km/h
    weatherCode: number;         // WMO код (0 = ясно, 61 = дъжд и т.н.)
  };
  daily: {
    date: string;
    max: number;
    min: number;
    rainChance: number;          // %
  }[];
};

export async function findCity(name: string): Promise<City | null> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', name);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'bg');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);

  const data = await res.json();
  const first = data.results?.[0];
  if (!first) return null;

  return {
    name: first.name,
    country: first.country,
    latitude: first.latitude,
    longitude: first.longitude,
  };
}

export async function getWeather(city: City): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(city.latitude));
  url.searchParams.set('longitude', String(city.longitude));
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
  );
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
  );
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '3');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast error: ${res.status}`);

  const data = await res.json();

  // Връщаме САМО полетата, които ни трябват.
  // По-малко данни = по-малко входни токени = по-ниска цена.
  return {
    city,
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    },
    daily: data.daily.time.map((date: string, i: number) => ({
      date,
      max: data.daily.temperature_2m_max[i],
      min: data.daily.temperature_2m_min[i],
      rainChance: data.daily.precipitation_probability_max[i],
    })),
  };
}