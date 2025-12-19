<script>
import { browser } from '$app/environment';
import { settings } from '$lib/settings.svelte';
import '../app.css';

let { children, data } = $props();

let serverUrl = `https://picsum.photos/seed/${data.seed}/1920/1080.webp`;
let customBgImage = (browser && localStorage.getItem("image") || "");

let bgUrl = $state(serverUrl);

$effect(() => {
  if (!browser) return;

   if(settings.bgSource === "customImage" && customBgImage) {
    bgUrl = customBgImage;
  } else {
    bgUrl = serverUrl;
  }
  const interval = setInterval(() => {
    const now = new Date();
    const newSeed = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
    if (newSeed !== currentSeed) {
      currentSeed = newSeed;
    }
  }, 1000 * 60);

  return () => clearInterval(interval);
});
</script>

<div class="background" style="--blur-amount: {settings.bgImageBlur}px" >
  <img 
    src={bgUrl} 
    alt="Background"
    aria-hidden="true"
  />
  <div class:overlay={settings.bgImageDarken}></div>
</div>

<main class:scroll={settings.showNews}>
  {@render children?.()}
</main>

<style>
.background {
  position: fixed;
  inset: 0;           
  z-index: -1;        
  overflow: hidden;
  background-color: var(--md-sys-color-background); 
}

.background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease-in-out;
  filter: blur(var(--blur-amount));
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); 
}

main {
  position: relative;
  height: 100dvh;
  overflow-y: hidden;
  scroll-behavior: smooth;
}
main.scroll {
  overflow-y: auto;
}
</style>
