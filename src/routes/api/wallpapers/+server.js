import { json } from '@sveltejs/kit';
import { WALLHAVEN_API_KEY } from '$env/static/private'; 

const WALLHAVEN_API_URL = 'https://wallhaven.cc/api/v1/search';

export async function GET({ url }) {
  const searchParams = url.searchParams;

  const apiURL = new URL(WALLHAVEN_API_URL);
  apiURL.search = searchParams.toString();
  try {
    const response = await fetch(apiURL, {
      headers: {
        'X-API-Key': WALLHAVEN_API_KEY,
        'User-Agent': 'web-homepage/1.0'
      }
    });

    if (!response.ok) {
      return json({ error: `API Error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error('Error proxying wallpaper request:', error);
    return json({ error: 'Failed to fetch wallpapers.' }, { status: 500 });
  }
}
