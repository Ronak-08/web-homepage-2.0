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
let fileName = $state('No File Chosen');
let initialImage = (browser && localStorage.getItem("image")) || null;
let customBgImage = $state(initialImage);

function handleImageUpload(event) {
  const files = event.target.files[0];
  if(!files) return;
  fileName = files.name;
  const read = new FileReader();
  read.onload = (e) => {
    customBgImage = e.target.result;
  };
  read.readAsDataURL(files);
}
function clearCustomImage() {
  customBgImage = null;
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
          <option value="customImage">Upload my image</option>
          <option value="default">Default</option>
        </select>

      </div>
      {#if settings.bgSource === 'customBgImage'}
        <div class="settings-card-2">
          <div class="wrap new">Darken Image <Switch bind:checked={settings.bgImageDarken} /></div>
          <div class="wrap">
            <input class="image-input" type="file" id="bg-upload" accept="image/png, image/jpeg, image/webp, image/gif" onchange={handleImageUpload}>
            <label for="bg-upload" class="file-label">{fileName}</label>
            {#if customBgImage}
              <button class="clear" onclick={clearCustomImage}>Clear Image</button>
            {/if}
          </div>
        </div>
      {/if}
      {#if settings.bgSource === 'customBgImage' || settings.bgSource === 'bgImage'}
        <div class="setting-slider">
          <label for="blur-slider">Background Blur</label>
          <div class="slider-controls">
            <input
              type="range"
              id="blur-slider"
              min="0"
              max="8"
              step="1"
              bind:value={settings.bgImageBlur}
            />
            <span>{settings.bgImageBlur}px</span>
          </div>
        </div>
      {/if}

      <div class="settings-card">
        Clock   <Switch bind:checked={settings.showClock} />
      </div>
      {#if settings.showClock}
        <div class="settings-card">
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
  gap: 1rem;
  margin-bottom: 1.2rem;
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
  background-color: var(--md-sys-color-surface-container-high);
  border-radius: 16px;
  width: 100%;
}
.new {
  padding: 1rem;
}
.file-label {
  display: flex;
  width:fit-content;
  background-color: var(--md-sys-color-secondary);
  color: var(--md-sys-color-on-secondary);
  align-items: center;
  border-radius: 13px;
  opacity: 0.7;
  padding: 5px 15px; 
  margin: 0.6rem;
}
.clear {
  padding: 5px 15px; 
  margin: 0.6rem;
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-radius: 13px; 
  font-size: 0.9rem;
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
  flex-direction: column;
  margin: 1rem;
}
.slider-controls {
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-weight: 600;
  color: var(--md-sys-color-primary);
  margin: 1rem;
}
input[type="range"] {
  appearance: none;
  cursor: pointer;
  width: 80%;
  height: 4px;
  background: var(--md-sys-color-secondary-container);
  margin: 0;
}
input[type="range"]::-webkit-slider-runnable-track,
input[type="range"]::-moz-range-track {
  background: var(--md-sys-color-secondary-container);
  height: 4px;
  border-radius: 36px;
  border: none;
}
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 25px;
  width: 7px;
  border-radius: 12px;
  background: var(--md-sys-color-on-secondary-container);
  border: none;
}
input[type="range"]::-moz-range-thumb {
  height: 25px;     
  width: 7px; 
  border-radius: 12px;
  background: var(--md-sys-color-on-secondary-container);
  border: none;
}
footer {
  font-size: 0.82rem;
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
