<script>
  export let checked = false;
  export let disabled = false;
  export let label = '';

  function toggle() {
    if (!disabled) {
      checked = !checked;
    }
  }
</script>

<button class="switch" on:click={toggle}>
  <input 
    type="checkbox" 
    bind:checked={checked}
    disabled={disabled}
  >
  <span class="slider round"></span>
  {#if label}
    <span class="switch-label-text">{label}</span>
  {/if}
</button>

<style>
  button {
   background-color: transparent;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 43px;
    height: 25px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--md-sys-color-surface-container);
    transition: .3s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 19px;
    width: 19px;
    left: 3px;
    bottom: 3px;
    background-color: var(--md-sys-color-on-surface);
    transition: .3s;
    border-radius: 50%;
    transform: scale(1);
  }
  .slider:hover:before {
    transform: scale(1.1);
  }

  input:checked + .slider {
    background-color: var(--md-sys-color-primary);
  }

  input:checked + .slider:before {
    transform: translateX(18px) scale(1);
    background-color: var(--md-sys-color-on-primary);
  }
  input:checked + .slider:hover:before {
    transform: translateX(18px) scale(1.1);
  }

  .switch-label-text {
    margin-left: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.875rem;
    color: var(--md-sys-color-on-surface);
  }

  input:disabled + .slider {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
