import { browser } from '$app/environment';

export async function getWeather(city) {
  if (!browser || !city) return null;

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

    if (!response.ok) throw new Error('Weather fetch failed');

    return await response.json();

  } catch (e) {
    console.error(e);
    return null;
  }
}
