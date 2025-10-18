import { json } from '@sveltejs/kit';
export async function GET({ url }) {
  const query = url.searchParams.get('q');
  if (!query) {
    return json({ error: 'Missing query parameter' }, { status: 400 });
  }
  try {
    const response = await fetch(`https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=json`);
    const suggestions = await response.json();

    return json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
