<script>
import {
  settings,
  customBgImage,
  fetchWallpapers,
} from "$lib/settings.svelte.js";
import { browser } from "$app/environment";
import "../app.css";

let { children } = $props();

let hour = $state(new Date().getHours());
let random = $state(0);

if(browser) {
const saved = JSON.parse(localStorage.getItem('random-seed'));
if(saved && saved.hour === hour) {
  random = saved.value;
} else {
    random = Math.random() * 10000;
    localStorage.setItem('random-seed',JSON.stringify({hour, value: random}));
  }
}
const bgUrl = $derived(`https://picsum.photos/seed/${random}/1080`);
const darkOverlay = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))";

$effect(async () => {
  if (!browser) return;
  const _ = hour; 
  const source = settings.bgSource;
  const root = document.documentElement;

  let imageUrl = 'none';
  let imageIsActive = false;
  if (source === "bgImage" && bgUrl) {
    imageUrl = `url(${bgUrl})`;
    imageIsActive = true;
  } else if (source === "wallhaven") {
    try {
      const images = await fetchWallpapers("landscape");
      if (images && images.length > 0) {
        const hourlyWallpaper = images[hour % images.length];
        if (hourlyWallpaper?.path) {
          imageUrl = `url("${hourlyWallpaper.path}")`;
          imageIsActive = true;
        }
      }
    } catch (error) { console.error('Error fetching wallpaper:', error); }
  } else if (settings.bgSource === "customImage" && customBgImage.image) {
    imageUrl = `url(${customBgImage.image})`;
    imageIsActive = true;
  }

  if (imageIsActive) {
    root.style.setProperty('--bg-image-url', imageUrl);
    root.style.setProperty('--bg-image-overlay', settings.bgImageDarken ? darkOverlay : 'none');
    document.body.style.backgroundColor = 'transparent';
  } else {
    root.style.setProperty('--bg-image-url', 'none');
    root.style.setProperty('--bg-image-overlay', 'none');
    document.body.style.backgroundColor = "#22172d";
    }
});

$effect(() => {
  if (!browser) return;
  document.body.style.overflow = settings.showNews ? "auto" : "hidden";
  if (customBgImage?.image) {
    localStorage.setItem("image", customBgImage.image);
  } else {
    localStorage.removeItem("custom-background-image");
  }
});

$effect(() => {
  if (!browser) return;
  const interval = setInterval(() => {
    const currentHour = new Date().getHours();
    if (currentHour !== hour) {
      hour = currentHour;
    }
  }, 60000);
  return () => {
    clearInterval(interval);
  };
});
</script>
{@render children?.()}
