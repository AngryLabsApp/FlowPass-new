<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let block = false;
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button
  type={type}
  class="btn {variant} {size} {block ? 'block' : ''}"
  disabled={disabled}
>
  <slot />
</button>

<style src="./Button.css"></style>
