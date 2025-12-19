<script>
import { browser } from '$app/environment';
import { settings } from '$lib/settings.svelte';
import '../app.css';
import { onMount, setContext } from 'svelte';

let { children, data } = $props();

let serverUrl = `https://picsum.photos/seed/${data.seed}/1920/1080.webp`;
let showImage = $state(true);

let bgUrl = $state(serverUrl);

const bgChange = () => {
  if (!browser) return;

   if(settings.bgSource === "customImage") {
    const stored = localStorage.getItem("image");
    if (stored) { bgUrl = stored; showImage = true; }
    else { bgUrl = serverUrl; showImage = true; }

  } else if(settings.bgSource === "bgImage")  {
    bgUrl = serverUrl;
    showImage = true;
  } else {
    showImage = false;
  }
}
setContext('layoutActions', {bgChange});
onMount(bgChange);

$effect(() => { 
  const interval = setInterval(() => {
    const now = new Date();
    const newSeed = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
    serverUrl = `https://picsum.photos/seed/${newSeed}/1920/1080.webp`;
    if(settings.bgSource === "bgImage") bgUrl = serverUrl;
  }, 1000 * 60);
  return () => clearInterval(interval);
})

</script>

<div class="background" style="--blur-amount: {settings.bgImageBlur}px" >
  {#if showImage}
  <img 
    src={bgUrl} 
    alt="Background"
    aria-hidden="true"
  />
  <div class:overlay={settings.bgImageDarken}></div>
{/if}
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
