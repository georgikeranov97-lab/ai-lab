import { findCity, getWeather } from '@/lib/weather';

// GET /api/weather?city=Madrid
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityName = searchParams.get('city')?.trim();

  // 1) Проверка на входа: без град няма какво да търсим.
  if (!cityName) {
    return Response.json(
      { error: 'Липсва параметър city' },
      { status: 400 },
    );
  }

  try {
    // 2) Намираме координатите на града.
    const city = await findCity(cityName);
    if (!city) {
      return Response.json(
        { error: `Не намерих град „${cityName}“` },
        { status: 404 },
      );
    }

    // 3) Взимаме прогнозата и я връщаме.
    const weather = await getWeather(city);
    return Response.json(weather);
  } catch (error) {
    // 4) Ако Open-Meteo не отговори, връщаме ясна грешка, а не срив.
    console.error(error);
    return Response.json(
      { error: 'Не успях да взема прогнозата. Опитай отново.' },
      { status: 502 },
    );
  }
}