<script>
import { browser } from "$app/environment";
import { settings } from "$lib/settings.svelte.js";
import { fade } from "svelte/transition";
import Settings from "$lib/components/settings.svelte";
import QuickLinks from "$lib/components/quickLinks.svelte";
import News from "$lib/components/news.svelte";
import { getWeather } from "$lib/weather.svelte.js";
import { onMount } from "svelte";


let query = $state("");
let suggestions = $state([]);
let showSuggestions = $state(false);
let open = $state(false);
let element;
let timeoutId;
const debounceDelay = 200;
let weatherData = $state(null);
let show = $state(false);
let showDropdown = $state(false);
let selectedEngine = $state(
  browser ? localStorage.getItem("searchEngine") || "google" : "google",
);
const searchEngines = {
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  brave: "https://search.brave.com/search?q=",
  perplexity: "https://www.perplexity.ai/search?q=",
  chatgpt: "https://chatgpt.com/?q=",
};

let debounceTimer;
$effect(() => {
  if (!settings.city) return;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    weatherData = await getWeather(settings.city);
  }, 2000);
});

async function getSuggestions() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  if (query.length === 0) {
    suggestions = [];
    showSuggestions = false;
    return;
  }
  timeoutId = setTimeout(async () => {
    try {
      const response = await fetch(`/api/suggestions?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        suggestions = data.map((item) => item.phrase);
        showSuggestions = true;
      } else {
        console.error("Failed to fetch suggestions");
        showSuggestions = false;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      showSuggestions = false;
    }
  }, debounceDelay);
}

function getTime() {
  let date = new Date();
  if (settings.twelvehrClock) {
    let hours = date.getHours() % 12 || 12;
    let minutes = String(date.getMinutes()).padStart(2, "0");
    let ampm = date.getHours() >= 12 ? "PM" : "AM";
    return { hours: `${hours}:${minutes}`, ampm };
  } else {
    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, "0");
    return { hours: `${hours}:${minutes}` };
  }
}

function greet() {
  const date = new Date();
  let hours = date.getHours();
  let greeting;
  if (hours >= 5 && hours < 12) {
    greeting = "Good Morning";
  } else if (hours >= 12 && hours < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  return `${greeting}`;
}

function toggleDropdown() {
  showDropdown = !showDropdown;
}

function selectEngine(engine) {
  selectedEngine = engine;
  showDropdown = false;
  saveSearchEngine();
}

function saveSearchEngine() {
  if (!browser) return;
  let savedEngine = localStorage.setItem("searchEngine", selectedEngine);
}

function handleSearch(event) {
  event.preventDefault();
  showSuggestions = false;

  if (query.trim()) {
    const trimmedQuery = query.trim();
    let searchURL = "";
    const lowerQuery = trimmedQuery.toLowerCase();

    if (lowerQuery.startsWith("yt ")) {
      const searchTerms = trimmedQuery.substring(3).trim();
      searchURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerms)}`;
    } else if (lowerQuery.startsWith("reddit ")) {
      const searchTerms = trimmedQuery.substring(7).trim();
      searchURL = `https://www.reddit.com/search?q=${encodeURIComponent(searchTerms)}`;
    } else if (lowerQuery.startsWith("github ")) {
      const searchTerms = trimmedQuery.substring(7).trim();
      searchURL = `https://github.com/search?q=${encodeURIComponent(searchTerms)}`;
    } else if (lowerQuery.startsWith("amazon ")) {
      const searchTerms = trimmedQuery.substring(7).trim();
      searchURL = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerms)}`;
    } else if (lowerQuery.startsWith("wikipedia ")) {
      const searchTerms = trimmedQuery.substring(9).trim();
      searchURL = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(searchTerms)}`;
    } else {
      const baseURL = searchEngines[selectedEngine];
      searchURL = baseURL + encodeURIComponent(trimmedQuery);
    }
    window.open(searchURL, "_blank");
    query = "";
  }
}

function closeSuggestions() {
  showSuggestions = false;
}

let time = $state(getTime());

$effect(() => {
  const interval = setInterval(() => {
    time = getTime();
  }, 60000);
  return () => clearInterval(interval);
});

$effect(() => {
  if (settings.twelvehrClock) {
    time = getTime();
  }
});

</script>

<Settings {show} />

<button
  class="settings-btn"
  onclick={() => {
    show = !show;
  }}><span class="material-symbols-outlined"> settings </span></button
>
{#if settings.showClock}
  <div class="time-display">
    <p class="date">{time.hours}</p>
    <span class="ampm">{time.ampm}</span>
  </div>
{/if}

{#if settings.greeting}
  <div class="greet-div">
    {greet()},
    <p>{settings.name}</p>
  </div>
{/if}

<form bind:this={element} onsubmit={handleSearch} class="search-form">
  <div class="searchBar">
    <div class="custom-select-wrapper">
      <div class="selected-display" onclick={toggleDropdown}>
        {#if browser}
          <img
            src="/{selectedEngine}.svg"
            alt={selectedEngine}
            class="engine-icon engine-i"
          />
        {:else}
          <img src="/google.svg" alt="google" class="engine-icon" />
        {/if}
        <span class="arrow material-symbols-outlined"> arrow_drop_down </span>
      </div>

      {#if showDropdown}
        <div transition:fade={{ duration: 100 }} class="options-dropdown">
          <div class="option-item" onclick={() => selectEngine("google")}>
            <img src="/google.svg" alt="Google" class="engine-icon" />
            <span>Google</span>
          </div>
          <div class="option-item" onclick={() => selectEngine("bing")}>
            <img src="/bing.svg" alt="Bing" class="engine-icon" />
            <span>Bing</span>
          </div>
          <div class="option-item" onclick={() => selectEngine("duckduckgo")}>
            <img src="/duckduckgo.svg" alt="DuckDuckGo" class="engine-icon" />
            <span>DuckDuckGo</span>
          </div>
          <div class="option-item" onclick={() => selectEngine("brave")}>
            <img src="/brave.svg" alt="Brave" class="engine-icon" />
            <span>Brave</span>
          </div>
          <div class="option-item" onclick={() => selectEngine("perplexity")}>
            <img src="/perplexity.svg" alt="Perplexity" class="engine-icon" />
            <span>Perplexity</span>
          </div>
          <div class="option-item" onclick={() => selectEngine("chatgpt")}>
            <img src="/chatgpt.svg" alt="chatgpt" class="engine-icon" />
            <span>ChatGpt</span>
          </div>
        </div>
      {/if}
    </div>

    <input
      oninput={getSuggestions}
      onfocus={() => {
        if (suggestions.length > 0) showSuggestions = true;
      }}
      class="search"
      autocomplete="off"
      placeholder="Search..."
      bind:value={query}
    />
    <button type="submit" class="search-btn"
    ><span class="material-symbols-outlined"> search </span></button
    >
    {#if suggestions.length > 0 && query.trim().length >= 1 && showSuggestions}
      <div class="overlay" onclick={closeSuggestions}></div>
      <ul class="suggestions-list">
        {#each suggestions as suggestion (suggestion)}
          <li
            onclick={() => {
              query = suggestion;
              handleSearch(event);
            }}
          >
            {suggestion}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</form>

{#if settings.quickLinks}
  <QuickLinks {open} />
{/if}
{#if settings.showNews}
  <News />
{/if}

{#if settings.showWeather}
  <div class="weather-container">
    {#if weatherData}
    <p class="temp">{weatherData.temperature}°C</p>
    <p class="desc">{weatherData.description}</p>
    {:else}
      <p class="desc">Loading...</p>
    {/if}
  </div>
{/if}

<style>
.date {
  font-size: clamp(6rem, 15vw, 9rem);
  text-align: center;
  font-weight: 700;
  margin-top: 1.6rem;
  text-shadow: 1px 2px 4px var(--md-sys-color-shadow);
  opacity: 0.9;
}
.time-display {
  display: flex;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  text-shadow: 1px 2px 4px var(--md-sys-color-shadow);
  align-items: center;
  opacity: 0.9;
  backdrop-filter: blur(4px);
  justify-content: center;
}
.ampm {
  font-size: 1.3rem;
  margin-left: 0.4rem;
  opacity: 0.7;
}
.search-form {
  position: sticky;
  top: 10px;
  z-index: 5;
}
.searchBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.8rem;
  background-color: rgba(20, 20, 21, 0.8);
  border-radius: 32px;
  color: var(--md-sys-color-on-primary-container);
  gap: 8px;
}
.search {
  padding: 1rem;
  font-size: 1.125rem;
  background-color: transparent;
  z-index: 1;
  border-radius: 32px;
  width: 100%;
  color: inherit;
}
.search-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.6rem;
  margin-right: 0.5rem;
  z-index: 2;
  border-radius: 50%;
  color: var(--md-sys-color-on-primary);
  transition: 0.3s all ease;
  background-color: var(--md-sys-color-primary);
}
.search-btn:hover,
.settings-btn:hover {
  transform: scale(1.03);
  opacity: 0.8;
}
.custom-select-wrapper {
  z-index: 1;
  user-select: none;
  -moz-user-select: none;
  width: fit-content;
  position: relative;
}

.selected-display {
  display: flex;
  align-items: center;
  margin: 0 0.6rem 0;
  padding: 0.4rem;
  background-color: var(--md-sys-color-surface-container-high);
  border-radius: 32px;
  width: 100%;
  cursor: pointer;
  transition: 0.2s all ease;
}
.selected-display:hover {
  border: 1.5px solid var(--md-sys-color-primary);
}

.engine-icon,
.engine-i {
  width: 28px;
  height: 28px;
  margin-right: 8px;
  border-radius: 2px;
}
.engine-i {
  margin: 0;
  padding: 0;
}

.options-dropdown {
  background-color: rgb(from var(--md-sys-color-primary-container) r g b / 0.6);
  backdrop-filter: blur(7px);
  border-radius: 13px;
  position: absolute;
  left: 0;
  box-shadow: 0 3px 20px rgba(0, 0, 0, 0.4);
  margin-top: 16px;
  min-width: 150px;
  z-index: 8;
}

.arrow {
  margin-right: 3px;
}
.option-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: 0.3s all ease;
}

.option-item:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
.settings-btn {
  padding: 5px;
  position: fixed;
  bottom: 15px;
  left: 15px;
  opacity: 0.2;
  z-index: 1;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3);
  background-color: var(--md-sys-color-secondary);
  color: var(--md-sys-color-on-secondary);
  border-radius: 32px;
  display: flex;
  align-items: center;
  transition: 0.3s all ease;
}
.weather-container {
  z-index: 1;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  position: fixed;
  align-items: center;
  display: flex;
  flex-direction: column;
  bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  right: 15px;
  width: fit-content;
  padding: 0.5rem 1.3rem;
  border-radius: 36px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.weather-container .temp {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--md-sys-color-primary);
  text-align: center;
}

.weather-container .desc {
  font-size: 0.8rem;
  text-align: center;
  padding-bottom: 0.3rem;
}
.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  list-style-type: none;
  padding: 0;
  padding: 1rem;
  margin: 7px auto;
  border-radius: 13px;
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 250px;
  max-width: 80vw;
  overflow-y: auto;
}
.suggestions-list li {
  padding: 0.5rem;
  transition: 0.2s all ease;
}
.suggestions-list li:hover {
  background-color: var(--md-sys-color-surface-container-high);
  border-radius: 13px;
}
.overlay {
  position: fixed;
  width: 100vw;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 0;
}
.greet-div {
  margin: 0 auto 3rem;
  width: fit-content;
  font-weight: 500;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  text-shadow: 1px 1px 2px black;
  user-select: none;
  -moz-user-select: none;
  padding: 0.5rem;
}
.greet-div p {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-radius: 32px;
  padding: 0 14px;
  font-weight: 600;
  width: fit-content;
  text-shadow: none;
}
@media (min-width: 768px) {
  .searchBar {
    max-width: 65vw;
    border-radius: 40px;
    margin: 2rem auto;
  }
  .search {
    padding: 1.3rem;
  }
  .suggestions-list {
    max-width: 60vw;
  }
  .greet-div {
    margin: 1rem auto;
  }
}
@media (min-width: 1024px) {
  .searchBar {
    max-width: 50vw;
  }
  .weather-container {
    top: 10px;
    left: 10px;
    height: fit-content;
  }
  .greet-div {
    padding-bottom: 0.7rem;
    font-size: 1.6rem;
  }
}
</style>
