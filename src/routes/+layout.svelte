<script>
import { settings, customBgImage, fetchWallpapers } from "$lib/settings.svelte.js";
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

async function getWallpaper() {
  if (!browser) return;
  try {
    const data = await fetchWallpapers("landscape");
    if (data?.length) {
      wallpapers = data;
    }
  } catch (error) {
    console.error("Failed to fetch wallpapers:", error);
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
  if (settings.bgSource === "wallhaven") {
    if (!wallpapers.length) await getWallpaper();
    if(wallpapers.length > 0) {
      const index = currentHour % wallpapers.length;
      bgUrl = wallpapers[index]?.path || "";
    }
  }
  else if(settings.bgSource === "bgImage") {
    bgUrl = `https://picsum.photos/seed/${random}/1080.webp`;
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
  if(settings.bgSource) setWallpaper();
  document.body.style.overflow = settings.showNews ? "auto" : "hidden";

  if (customBgImage?.image) {
    localStorage.setItem("custom-background-image", customBgImage.image);
  } else {
    localStorage.removeItem("custom-background-image");
  }
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
