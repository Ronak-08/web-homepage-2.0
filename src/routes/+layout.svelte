<script>
import { settings, customBgImage} from "$lib/settings.svelte.js";
import { browser } from "$app/environment";
import "../app.css";
import { onMount } from "svelte";

let { children } = $props();
let currentHour = $state(new Date().getHours());
let wallpapers = $state([]);


onMount(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js', { type: 'module' })
        .then((registration) => {
          console.log('Service worker registered!', registration);
        })
        .catch((err) => {
          console.error('Service worker registration failed:', err);
        });
    });
  }
});

const CACHE_DURATION = 1000 * 60 * 180; 

async function fetchWallpapers(query = '', page = 1, sorting = 'random') {
  const cacheKey = `wallpapers-${query}-${page}-${sorting}`;

  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      const now = Date.now();

      if (now - parsed.timestamp < CACHE_DURATION) {
        console.log('Returning cached wallpaper data from localStorage');
        return parsed.data || [];
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

    return data.data || [];
  } catch (error) {
    console.error('Error fetching wallpapers:', error);
    return [];
  }
}

function hourlyRandom() {
  if (!browser) return 1;
  const hour = new Date().getHours();
  const seed = localStorage.getItem('hourlySeed');
  const data = seed ? JSON.parse(seed) : {};
  if (data.hour === hour) return data.value;
  const value = Math.random();
  localStorage.setItem('hourlySeed', JSON.stringify({ hour, value }));
  return value;
}

let random = $state(hourlyRandom());
let bgUrl = $state("");

const setWallpaper = async () => {
  if (!browser) return;
  customBgImage.image = localStorage.getItem("custom-background-image") || customBgImage.image;
  if(settings.bgSource === "customImage" && customBgImage?.image) {
    bgUrl = customBgImage.image;
  }
  else if (settings.bgSource === "wallhaven") {
    if (!wallpapers.length)
      try {
        const data = await fetchWallpapers("landscape"); 
        if(data?.length) {
          wallpapers = data;
        }
      } catch (error) {
      console.error("Failed to fetch wallpapers:", error);
    }
    if(wallpapers?.length) {
      const index = currentHour % wallpapers.length;
      bgUrl = wallpapers[index]?.path || `https://picsum.photos/seed/${random}/1080.webp`;
    }
  }
  else if(settings.bgSource === "bgImage") {
    bgUrl = `https://picsum.photos/seed/${random}/1080.webp`;
  } else {
    return;
  }
  const img = new Image();
  img.src = bgUrl;
  img.onload = () => {
    document.documentElement.style.setProperty("--bg-image-url", `url(${bgUrl})`);
    document.documentElement.style.setProperty("--bg-image-overlay", "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))");
    document.documentElement.style.setProperty("--bg-opacity", "1");
    document.documentElement.style.transition = "background-image 0.4s ease-out, filter 0.2s ease-out";
  };
};

$effect(() => {
  if (!browser) return;
  const _currentHour = currentHour;
  const _random = random;
  const _bgSource = settings.bgSource;
  const _customBg = customBgImage?.image;
  setWallpaper();
});

$effect(() => {
  if (!browser) return;
  if (customBgImage?.image) {
    localStorage.setItem("custom-background-image", customBgImage.image);
  } else {
    localStorage.removeItem("custom-background-image");
  }
});
$effect(() => {
  if (!browser) return;
  document.body.style.overflow = settings.showNews ? "auto" : "hidden";
});
$effect(() => {
  const interval = setInterval(() => {
    currentHour = new Date().getHours();
    random = hourlyRandom();
  }, 60 * 60 * 1000); 

  return () => clearInterval(interval);
});
</script>

<main>
  {@render children?.()}
</main>
