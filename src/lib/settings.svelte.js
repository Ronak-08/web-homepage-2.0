import { browser } from "$app/environment";
const defaultSettings = {
  bgSource: 'bgImage',
  showClock: true,
  twelvehrClock: false,
  greeting: false,
  name: "User",
  bgImageDarken: true,
  bgImageBlur: 4,
  showWeather: false,
  showNews: false,
  city: null,
  topBar: false,
  quickLinks: true,
};

const initialImage = (browser && localStorage.getItem("image")) || null;
export const customBgImage = $state({image: initialImage});

function loadSettings() {
  if(!browser) {
    return defaultSettings;
  }

  const savedSettings = localStorage.getItem('settings');

  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      return { ...defaultSettings, ...parsed };
    } catch (e) {
      console.error("Failed to parse settings from localStorage", e);
      return defaultSettings;
    }
  }
  return defaultSettings;
}

export const settings = $state(loadSettings());

const CACHE_DURATION = 1000 * 60 * 180; 

export async function fetchWallpapers(query = '', page = 1, sorting = 'random') {
  const cacheKey = `wallpapers-${query}-${page}-${sorting}`;

  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      const now = Date.now();

      if (now - parsed.timestamp < CACHE_DURATION) {
        console.log('Returning cached wallpaper data from localStorage');
        return parsed.data;
      } else {
        localStorage.removeItem(cacheKey);
      }
    } catch (e) {
      console.error('Error parsing cached data:', e);
      localStorage.removeItem(cacheKey);
    }
  }

  try {
    const params = new URLSearchParams({
      q: query,
      sorting: sorting,
      page: page,
      purity: '110',
      resolutions: '1920x1080,2560x1440,3840x2160',
      at_least: '1920x1080'
    });

    const response = await fetch(`/api/wallpapers?${params}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    localStorage.setItem(cacheKey, JSON.stringify({
      data: data.data,
      timestamp: Date.now()
    }));

    return data.data;
  } catch (error) {
    console.error('Error fetching wallpapers:', error);
    return [];
  }
}

