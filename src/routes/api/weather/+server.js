import { json } from '@sveltejs/kit';
const geoCache = new Map();

export async function GET({ url, setHeaders }) {
  const city = url.searchParams.get('city');
  if (!city) return json({ error: 'No city provided' }, { status: 400 });

  try {
    let lat, lon, cityName;

    const cacheKey = city.toLowerCase();
    if (geoCache.has(cacheKey)) {
      ({ lat, lon, cityName } = geoCache.get(cacheKey));
    } else {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results?.[0]) return json({ error: 'City not found' }, { status: 404 });

      const result = geoData.results[0];
      lat = result.latitude;
      lon = result.longitude;
      cityName = result.name;
      geoCache.set(cacheKey, { lat, lon, cityName });
    }

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
    );
    const data = await weatherRes.json();

    const descriptions = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 51: 'Light drizzle', 61: 'Slight rain', 71: 'Slight snow',
      80: 'Slight rain showers', 95: 'Thunderstorm'
    };

    const finalData = {
      temperature: data.current.temperature_2m,
      description: descriptions[data.current.weather_code] || 'Unknown',
      city: cityName
    };

    setHeaders({
      'Cache-Control': 'public, max-age=1200, s-maxage=1200' 
    });

    return json(finalData);

  } catch (error) {
    return json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
