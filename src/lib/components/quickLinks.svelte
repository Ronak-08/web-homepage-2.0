<script>
import { quickLinks,addLink, removeLink } from "$lib/link.svelte.js";
import { fade, fly } from "svelte/transition";
import { browser } from '$app/environment';

let showAddForm = $state(false);
let { open = false } = $props(); 
let newName = $state("");
let newUrl = $state("");

function addNewLink() {
  if(newName && newUrl) {
    addLink(newName,newUrl);
    showAddForm = false
    newName = "";
    newUrl = "";
  }
}
</script>

<div class="quick-links">
  <div class="links-grid">
    {#each quickLinks as link (link.id)}
      <a 
        href={link.url} 
        class="link-item"
        transition:fly="{{ y: 20, duration: 200 }}"
        target="_blank"
        rel="noopener"
      >
        {#if browser && link.icon}
        <img 
          src={link.icon} 
          alt="{link.name} icon" 
          class="favicon"
        />
       {/if}

        <span class="link-name">{link.name}</span>
        <button 
          class="remove-btn"
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeLink(link.id);
          }}
        >×</button>
      </a>
    {/each}

    {#if showAddForm}
      <div onclick={() => {showAddForm = !showAddForm}} class="overlay"></div>
      <div class="add-form" transition:fly="{{ y: -30, duration: 200 }}">
        <h2>New Link</h2>
        <input
          bind:value={newName}
          required
          placeholder="Name"
          class="input"
        />
        <input
          bind:value={newUrl}
          placeholder="URL"
          type="url"
          class="input"
        />
        <div class="form-actions">
          <button onclick={() => showAddForm = false} class="btn btn-secondary">Cancel</button>
          <button onclick={addNewLink} class="btn btn-primary">Add</button>
        </div>
      </div>
    {/if}
      <button 
        onclick={() => {showAddForm = true}}
        class="add-btn"
        transition:fade={{duration: 200}}
      >
        <span class="material-symbols-outlined">add</span>
      </button>
  </div>
</div>


<style>
.quick-links {
  margin: 2rem;
  max-height: 200px;
  overflow-y: auto;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,50px);
  justify-content: center;
  gap: 1rem;
  row-gap: 1.6rem;
  max-width: 400px;
  margin: 1rem auto;
}

.link-item {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: fit-content;
  align-items: center;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.link-item img {
  border-radius: 32px;
  background-color: var(--md-sys-color-surface-container-highest);
  border: 1px solid var(--md-sys-color-outline-variant);
}
.link-name {
  font-size: 0.8rem;
  max-width: 65px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-top: 0.3rem;
  text-shadow: -1px 1px 4px black;
  text-align: center;
}

.remove-btn {
  position: absolute;
  top: -11px;
  right: -11px;
  background: var(--md-sys-color-tertiary);
  color: var(--md-sys-color-on-tertiary); 
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.link-item:hover .remove-btn {
  opacity: 1;
}

.add-btn, .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 26px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
  width: 40px;
  height: 40px;
  transition: 0.2s all ease;
}
.add-btn:active {
  transform: scale(0.95);
}

.add-form {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  gap: 0.5rem;
  padding: 1.5rem;
  border-radius: 13px;
  z-index: 9;
  box-shadow: -2px 2px 8px var(--md-sys-color-shadow);
  background-color:var(--md-sys-color-surface-container);
}

.input {
  padding: 0.7rem;
  border-radius: 10px;
  color: inherit;
  background-color:var(--md-sys-color-surface-container-high);
  transition: all 0.2s ease;
}
.input:focus {
  border: 2px solid var(--md-sys-color-primary);
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-actions {
  display: flex;
  gap: 0.4rem;
  margin-top: 1rem;
  justify-content: flex-end;
}
.btn {
  min-height: auto;
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  min-width: fit-content;
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
}
.btn-secondary{ 
  border: 2px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container);
  color:  var(--md-sys-color-primary);
}
.overlay {
  position: fixed;
  width: 100vw;
  background-color: rgba(0,0,0,0.6);
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 8;
}
h2 {
  font-weight: 500;
  font-size: 1.7rem;
  color: var(--md-sys-color-on-surface);
  margin-bottom: 0.6rem;
}
@media (min-width: 768px) {
  .quick-links {
    margin-top: 4rem;
  }
  .links-grid {
    max-width: 500px;
    gap: 2rem;
  }
  .add-form {
    width: 50vw;
  }
}
@media (min-width: 1024px) {
  .links-grid {
    max-width: 50vw;
  }
.link-item img {
    width: 40px;
  }
.link-name {
   font-size: 0.90rem;
  }
  .add-form {
    width: 30vw;
  }
}

</style>

