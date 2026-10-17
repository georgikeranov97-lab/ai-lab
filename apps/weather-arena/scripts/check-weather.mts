import { findCity, getWeather } from '../lib/weather';

const city = await findCity('Мадрид');
if (!city) throw new Error('Градът не е намерен');

const weather = await getWeather(city);
console.log(JSON.stringify(weather, null, 2));