<script>
  import { browser } from '$app/environment';
  import { settings } from '$lib/settings.svelte';
  import { onMount, setContext } from 'svelte';
  import '../app.css';

  let { children } = $props();

  let now = $state(new Date());
  let imgLoaded = $state(false);

  let customImage = $state(null);

  let serverUrl = $derived.by(() => {
    const seed = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
    return `https://picsum.photos/seed/${seed}/1920/1080.webp`;
  });

  let bgUrl = $derived.by(() => {
    if (settings.bgSource === "bgImage") {
      return serverUrl;
    } 
    if (settings.bgSource === "customImage") {
      return customImage ?? serverUrl; 
    }
    return null; 
  });

  const refreshCustomImage = () => {
    if (!browser) return;
    const stored = localStorage.getItem("image");
    if (stored !== customImage) {
      customImage = stored;
    }
  };

  setContext('layoutActions', { refreshCustomImage });

  onMount(() => {
    refreshCustomImage();
    const interval = setInterval(() => {
      now = new Date();
    }, 60000);

    return () => clearInterval(interval);
  });

  $effect(() => {
    bgUrl; 
    imgLoaded = false;
  });
</script>


<div class="background" style="--blur-amount: {settings.bgImageBlur}px" >
    <img 
      src={bgUrl} 
      alt="" 
      aria-hidden="true"
      fetchpriority="high" 
      decoding="async" 
      draggable="false"
      class:visible={imgLoaded}
      onload={() => imgLoaded = true}
    />
    {#if settings.bgImageDarken}
      <div class="overlay" in:fade={{ duration: 500 }}></div>
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
  will-change: transform, filter;
  opacity: 0;
  transition: opacity 0.7s cubic-bezier(0.2, 0.0, 0.2, 1);

  filter: blur(var(--blur-amount));
  transform: scale(1.05);
}
.background img.visible {
    opacity: 1;
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
  scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}
</style>
