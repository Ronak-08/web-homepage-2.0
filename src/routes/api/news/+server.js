import { json } from '@sveltejs/kit';
import Parser from 'rss-parser';
const GOOGLE_NEWS_URL = 'https://news.google.com/rss';

export async function GET() {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(GOOGLE_NEWS_URL);
    const articles = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      isoDate: item.isoDate,
    }));
    return json({ articles });
  } catch (error) {
    console.error('Failed to fetch or parse RSS feed:', error);
    return json({ error: 'Failed to retrieve news.' }, { status: 500 });
  }
}
