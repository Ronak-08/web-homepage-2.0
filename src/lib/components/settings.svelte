<script>
import { settings } from "$lib/settings.svelte.js";
import Switch from "$lib/components/switch.svelte";
import { browser } from "$app/environment";
import { fade } from "svelte/transition";
import { getWeather } from "$lib/weather.svelte";

let {show = false} = $props();
$effect(() => {
  if (browser) {
    localStorage.setItem('settings', JSON.stringify(settings));
  }
});
let  customBgImage = $state(browser && localStorage.getItem("image") || null);

function handleImageUpload(event) {
 const file = event.target.files[0];
  if(!file) return;
  const read = new FileReader();
  read.onload = (e) => {
   customBgImage = e.target.result;
  if(browser) localStorage.setItem("image", customBgImage);
  };
  read.readAsDataURL(file);
}

function clearCustomImage() {
  customBgImage = null;
  if(browser) localStorage.removeItem("image");
}

function handleKeyDown(event) {
  if(event.key === 'Enter') {
    getWeather(settings.city);
  } 
}



</script>

{#if show}
  <main transition:fade={{duration: 200}} class="container"> 
    <div class="header">
      <button class="close-btn" onclick={() => {show = false}}> <span class="material-symbols-outlined">
        close
      </span> </button>
      <h1>Settings</h1>
    </div>
    <div class="settings-container">
      <div class="settings-card">
        Background   
       <select class="select-data" name="bg-soruce" bind:value={settings.bgSource} id="bg-source">
        <option value="bgImage">Image</option>
        <option value="customImage">Custom Image</option>
        <option value="default">Default</option>
        </select>

      </div>
      {#if settings.bgSource === 'customImage'}
        <div class="settings-card-2">
       <div class="wrap new">Darken Image <Switch bind:checked={settings.bgImageDarken} /></div>
          <div class="wrap">
            <label class="btn">Upload Image
            <input class="image-input" type="file" accept="image/*" onchange={handleImageUpload} hidden>
              </label>
            {#if customBgImage}
              <button class="clear" onclick={clearCustomImage}>Remove</button>
            {/if}
          </div>
        </div>
      {/if}
      {#if settings.bgSource !== "default"}
        <div class="setting-slider">
          <span>Blur ({settings.bgImageBlur}px)</span>
            <input
              type="range"
              min="0"
              max="10"
              bind:value={settings.bgImageBlur}
            />
          </div>
      {/if}

      <section>
      <div class="settings-card" >
        Clock   <Switch bind:checked={settings.showClock} />
      </div>
      {#if settings.showClock}
      <div class="settings-card" style="margin: 0.5rem 1rem; padding: 0.7rem; opacity: 0.9;">
        12hr Clock   <Switch bind:checked={settings.twelvehrClock} />
      </div>
      {/if}
      <div class="settings-card">
        Greeting  <Switch bind:checked={settings.greeting} />
      </div>
      {#if settings.greeting} 
         <input class="name-input" max="30" type="text" bind:value={settings.name} placeholder="Enter name...">
      {/if}

      <div class="settings-card">
        Weather  <Switch bind:checked={settings.showWeather} />
      </div>

      {#if settings.showWeather} 
        <div class="location-input">
      <label for="location">Location</label> <input bind:value={settings.city} type="text" placeholder="Enter Location" id="location" onkeydown={() => {handleKeyDown(event)}}>
    </div>
      {/if}
      <div class="settings-card">
        News <Switch bind:checked={settings.showNews} />
      </div>
      <div class="settings-card">
        Quick Links <Switch bind:checked={settings.quickLinks} />
      </div>
        </section>

    </div>
    <footer>
      <p>Made by Ronak © 2025</p>
      <p>
        <a href="https://github.com/Ronak-08/web-homepage-2.0">GitHub</a> |
        Like this website? Try <a href="https://tasksmaster01.netlify.app">Tasksmaster</a>!
      </p>
    </footer>
  </main>
{/if}

<style>


.container {
  height: 100dvh;
  position: fixed;
  top:0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  z-index: 999;
  width: 100%;
  background-color: var(--md-sys-color-surface-container);
}
.header {
  display: flex;
  align-items: center;
  padding: 0.6rem;
  margin-bottom: 1rem;
  gap: 16px;
}
.close-btn {
  padding: 5px;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.3);
  background-color: transparent;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 32px;
  margin: 0.2rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}
.close-btn:active {
  border-radius: 14px;
  transform: scale(0.98);
}
.btn {
  padding: 0.4rem 0.5rem;
  margin: 0.5rem;
  color: var(--md-sys-color-secondary);
  border-radius: 16px;
  border: 2px solid var(--md-sys-color-outline-variant);

}

.settings-container {
  display: flex;
  flex-direction: column;
  margin: 2rem 1rem;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.4rem;
  gap: 10px;
  flex: 1;
}
.settings-card {
  display: flex;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  font-weight: 500;
  border-radius: 16px;
  transition: 0.3s all ease;
}
.settings-card:hover {
 font-weight: 500;
  opacity: 0.95;
}
section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.select-data {
  width: 30%;
  text-align: center;
  background-color: var(--md-sys-color-secondary);
  color: var(--md-sys-color-on-secondary);
  padding: 3px;
  border-radius: 13px;
  font-size: 0.9rem;
  font-weight: 600;
}
.settings-card-2 {
    display: flex;
  flex-direction: column;
    gap: 0.7rem;
  background-color: var(--md-sys-color-surface-container);
  margin: 0 1rem;
  }
.image-input {
  position:absolute;
  opacity: 0;
  padding: 3px;
  border-radius: 13px;
  font-size: 0.9rem;
  font-weight: 600;
}
.wrap {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--md-sys-color-surface-container-high);
  border-radius: 16px;
}
.new {
  padding: 0.9rem;
}
.clear {
  padding: 5px 15px; 
  margin: 0.6rem;
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-radius: 17px; 
  font-size: 0.9rem;
  transition: all 0.2s ease;
}
.clear:active {
  border-radius: 13px;
  opacity: 0.8;
  transform: scale(0.98);
}
.name-input {
  background-color: var(--md-sys-color-surface-container-low);
  padding: 0.5rem 1rem;
  border-radius: 16px;
  margin: 1rem;
  border: 1px solid var(--md-sys-color-outline);
  transition: 0.2s all ease;
}
.name-input:focus {
  border: 2px solid var(--md-sys-color-primary);
}
.location-input {
 display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--md-sys-color-surface-container-high);
  padding: 0.5rem 1rem;
  border-radius: 16px;
  margin: 1rem;
}
.location-input label {
  font-size: 0.8rem;
}
.location-input input {
  padding: 10px;
  border-radius: 32px;
  max-width: 40%;
  text-align: center;
  font-weight: 600;
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
.setting-slider {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 1rem;
  border-radius: 16px;
  border: 2px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container-high);
  padding: 0.5rem 0.9rem;
  font-size: 0.95rem;
  align-items: center;

}
input[type="range"] {
  appearance: none;
  cursor: pointer;
  height: 4px;
  background: transparent;
  margin: 0;
  transition: opacity 0.2s ease;
}

input[type="range"]::-webkit-slider-runnable-track {
  background: var(--md-sys-color-secondary-container);
  height: 4px;
  border-radius: 36px;
  border: none;
  transition: background-color 0.3s ease;
}

input[type="range"]::-moz-range-track {
  background: var(--md-sys-color-secondary-container);
  height: 4px;
  border-radius: 36px;
  border: none;
  transition: background-color 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 6px; 
  border-radius: 18px;
  background: var(--md-sys-color-on-secondary-container);
  border: none;
  margin-top: -8px; 
  box-shadow: 0 0 0 0px rgba(var(--md-sys-color-on-secondary-container), 0);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              background-color 0.2s ease,
              box-shadow 0.2s ease;
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 6px;
  border-radius: 18px;
  background: var(--md-sys-color-on-secondary-container);
  border: none;
  box-shadow: 0 0 0 0px rgba(var(--md-sys-color-on-secondary-container), 0);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              background-color 0.2s ease, 
              box-shadow 0.2s ease;
}

input[type="range"]:hover::-webkit-slider-thumb {
  transform: scale(1.2);
  background: var(--md-sys-color-primary);
}
input[type="range"]:hover::-moz-range-thumb {
  transform: scale(1.2);
  background: var(--md-sys-color-primary);
}

input[type="range"]:active::-webkit-slider-thumb {
  transform: scale(1.4);
  box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.2);
  cursor: grabbing;
}
input[type="range"]:active::-moz-range-thumb {
  transform: scale(1.4);
  box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.2);
  cursor: grabbing;
}

footer {
  font-size: 0.81rem;
  width: 100%;
  text-align: center;
  color:  var(--md-sys-color-on-surface-variant);
  margin: 0.6rem 0;
}
footer a {
  color:  var(--md-sys-color-primary);
}

@media (min-width: 768px) {
  .container {
    width: 50%;
  }
}
@media (min-width: 1024px) {
  .container {
    width: 30%;
  }
}
</style>
