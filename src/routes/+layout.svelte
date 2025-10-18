<script>
import {
  settings,
  customBgImage,
  backgroundColor,
  fetchWallpapers,
} from "$lib/settings.svelte.js";
import favicon from "$lib/assets/favicon.svg";
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
  const root = document.documentElement;

  let imageUrl = 'none';
  let imageIsActive = false;
  if (settings.bgSource === "bgImage" && bgUrl) {
    imageUrl = `url(${bgUrl})`;
    imageIsActive = true;
    root.style.setProperty("--md-sys-color-primary", "rgb(219 185 249)");
    root.style.setProperty("--md-sys-color-secondary", "rgb(209 193 217)");
  } else if (settings.bgSource === "wallhaven") {
    try {
      const images = await fetchWallpapers("landscape");
      if (images && images.length > 0) {
        const hourlyWallpaper = images[hour % images.length];
        if (hourlyWallpaper?.path) {
          imageUrl = `url("${hourlyWallpaper.path}")`;
          imageIsActive = true;
          const primaryColor = hourlyWallpaper.colors[1];
          const secondaryColor = hourlyWallpaper.colors[0];
          root.style.setProperty("--md-sys-color-primary", primaryColor);
          root.style.setProperty("--md-sys-color-secondary", secondaryColor);
        }
      }
    } catch (error) { console.error('Error fetching wallpaper:', error); }
  } else if (settings.bgSource === "customImage" && customBgImage.image) {
    imageUrl = `url(${customBgImage.image})`;
    imageIsActive = true;
    root.style.setProperty("--md-sys-color-primary", "rgb(219 185 249)");
    root.style.setProperty("--md-sys-color-secondary", "rgb(209 193 217)");
  }

  if (imageIsActive) {
    root.style.setProperty('--bg-image-url', imageUrl);
    root.style.setProperty('--bg-image-overlay', settings.bgImageDarken ? darkOverlay : 'none');
    document.body.style.backgroundColor = 'transparent';
  } else {
    root.style.setProperty('--bg-image-url', 'none');
    root.style.setProperty('--bg-image-overlay', 'none');

    if (settings.bgSource === "color") {
      document.body.style.backgroundColor = backgroundColor.color;
    } else {
      document.body.style.backgroundColor = "#22172d";
    }
  }
});

$effect(() => {
  if (browser) {
    localStorage.setItem("savedColor", JSON.stringify(backgroundColor.color));
  }
  if (settings.showNews) {
    document.body.style.overflow = "auto";
  } else {
    document.body.style.overflow = "hidden";
  }
});
$effect(() => {
  if (browser) {
    if (customBgImage) {
      localStorage.setItem("image", customBgImage.image);
    } else {
      localStorage.removeItem("custom-background-image");
    }
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
