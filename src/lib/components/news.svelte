<script>
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { settings } from "$lib/settings.svelte.js";
let news = $state({ articles: [], loading: true, error: null });

let loading = $derived(news.loading);
let error = $derived(news.error);

async function loadNews() {
  if (!settings.showNews) return;
  try {
    const response = await fetch('/api/news');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    news.articles = data.articles;
  } catch (err) {
    news.error = err.message;
  } finally {
    news.loading = false;
  }
}
onMount(() => {
  loadNews();
})
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>

<div class="news-container">
  <h2>News</h2>

  {#if loading}
    <p class="loading">Loading news...</p>
  {:else if error}
    <p class="error">Error: {error}</p>
  {:else}
    <ul class="news-list">
      {#each news.articles.slice(0, 10) as article (article.link)}
        <li class="news-item">
          <a href={article.link} target="_blank" rel="noopener noreferrer">
            <span class="title">{article.title}</span>
            <span class="date">{formatDate(article.isoDate)}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
.news-container {
  max-height: 80vh;
  margin: 1.1rem;
  position: relative;
  top: 80px; 
  padding: 0.4rem;
  background-color: var(--md-sys-color-surface-container-low);
  overflow-y: auto;
  border-radius: 16px;
}
h2 {
  margin: 1rem 1rem 1.6rem 1.3rem;
  font-weight: 600;
}
.news-list {
  list-style: none;
  padding: 0;
}
.news-item a {
  display: block;
  padding: 1rem;
  margin: 1rem;
  font-size: 0.95rem;
  text-decoration: none;
  color: var(--md-sys-color-on-surface);
  background-color: var(--md-sys-color-surface-container);
  border-radius: 13px;
  transition: all 0.2s ease;
  word-spacing: 2.3;
}
.news-item a:hover {
  background-color: var(--md-sys-color-surface-container-high);
  color:  var(--md-sys-color-primary);
  transform: scale(1.02);
}
.title {
  font-weight: 500;
  display: block;
  margin-bottom: 0.5rem;
}
.date {
  font-size: 0.8rem;
  color: darkgray;
}
.error {
  color: var(--md-sys-color-error);
}
.loading {
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.7;
  animation: pulse 2s infinite;
  margin: 1rem;
}
@keyframes pulse {
0% {
  opacity: 0;
}
50% {
  opacity: 0.5;
}
100% {
  opacity: 1;
}
}
@media (min-width: 768px) {

.news-container {
    max-width: 64vw;
    margin:auto;
  }
}
</style>
