import { json } from '@sveltejs/kit';
import Parser from 'rss-parser';

const GOOGLE_NEWS_URL = 'https://news.google.com/rss';
const parser = new Parser();
const CACHE_SECONDS = 1200;

export async function GET() {
  try {
    const feed = await parser.parseURL(GOOGLE_NEWS_URL);
    const articles = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      isoDate: item.isoDate,
    }));
    return json(
      { articles },
      {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch RSS feed:', error);
    return json(
      { error: 'Failed to retrieve news.' },
      { status: 500 }
    );
  }
}
