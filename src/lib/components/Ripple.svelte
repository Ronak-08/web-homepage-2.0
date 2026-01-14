<script>
let ripples = $state([]);
let container;

function createRipple(e) {
  const rect = container.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const id = Date.now();
  ripples.push({ id, x, y, size });

  setTimeout(() => {
    ripples = ripples.filter(r => r.id !== id);
  }, 600);
}

$effect(() => {
  const parent = container?.parentElement;
  if (!parent) return;

  parent.style.position = parent.style.position || 'relative';
  parent.style.overflow = 'hidden';
  parent.addEventListener('pointerdown', createRipple);

  return () => parent.removeEventListener('pointerdown', createRipple);
});
</script>

<div bind:this={container} class="ripple-container">
  {#each ripples as ripple (ripple.id)}
    <span 
      class="ripple"
      style="left: {ripple.x}px; top: {ripple.y}px; width: {ripple.size}px; height: {ripple.size}px;"
    ></span>
  {/each}
</div>

<style>
.ripple-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.10;
  transform: scale(0);
  animation: ripple-effect 600ms ease-out;
  pointer-events: none;
}

@keyframes ripple-effect {
to {
  transform: scale(1);
  opacity: 0;
}
}
</style>
