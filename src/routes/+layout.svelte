<script>
  import { settings } from "$lib/settings.svelte.js";
  import { browser } from "$app/environment";
  import "../app.css";
  import { onMount } from "svelte";

  let { children } = $props();

  let currentHour = $state(new Date().getHours());
  let random = $state(null);
  let isMounted = $state(false);
  let customBgImage = (browser && localStorage.getItem("image") || null);

  let bgStyle = $derived.by(() => {
    if (!isMounted) return 'none';

    switch (settings.bgSource) {
      case 'bgImage':
        return `url(https://picsum.photos/seed/${random}/1920/1080)`;
      case 'customBgImage':
        return customBgImage ? `url(${customBgImage})` : 'none';
      default:
        return 'none';
    }
  });
  
  onMount(() => {
    random = hourlyRandom();
    isMounted = true;
  });

  function hourlyRandom() {
    const hour = new Date().getHours();
    const seed = localStorage.getItem('hourlySeed');
    const d = seed ? JSON.parse(seed) : {};
    if (d.hour === hour) return d.value;
    const value = Math.random();
    localStorage.setItem('hourlySeed', JSON.stringify({ hour, value }));
    return value;
  }

</script>

<main 
  class:darken={settings.bgImageDarken} 
  style:--bg-url={bgStyle}
  style:--blur-amount="{settings.bgImageBlur}px"
>
  <div class="content">
    {@render children?.()}
  </div>
</main>

<style>
  main {
    position: relative;
    min-height: 100vh;
    background-color: var(--md-sys-color-surface-container-high);
    overflow: hidden; 
    isolation: isolate;
  }

  main::before {
    content: '';
    position: absolute;
    inset: -20px; 
    background-image: var(--bg-url);
    background-size: cover;
    background-position: center;
    filter: blur(var(--blur-amount));
    z-index: -2;
    transition: background-image 0.5s ease;
  }

  main.darken::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4); 
    z-index: -1;
    pointer-events: none;
  }

  .content {
    position: relative;
    z-index: 1;
    overflow-y: auto;
  }
</style>
