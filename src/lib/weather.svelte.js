import { browser } from '$app/environment';

const CACHE_DURATION = 20 * 60 * 1000;

export async function getWeather(city) {
  if (!browser) return null;

  const cacheKey = `weather_${city.toLowerCase()}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  try {
    const geocode = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    const geoData = await geocode.json();

    if (!geoData.results?.[0]) return null;
    const { latitude, longitude, name } = geoData.results[0];
    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
    );
    const data = await weather.json();

    const descriptions = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 51: 'Light drizzle', 61: 'Slight rain', 71: 'Slight snow',
      80: 'Slight rain showers', 95: 'Thunderstorm'
    };

    let weatherData = {
      temperature: data.current.temperature_2m,
      description: descriptions[data.current.weather_code] || 'Unknown weather',
      city: name
    };
    const cacheData = {
      data: weatherData,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));

    return weatherData;
  } catch (e) {
    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }
    return null;
  }
}
