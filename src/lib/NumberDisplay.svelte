<script lang="ts">
  export let multiplier = 100;
  export let value = 0;
</script>

<input
  type="number"
  {...$$restProps}
  value={+(value * multiplier).toFixed(2)}
  readonly
/>

<style>
  input {
    opacity: 0.6;
    font-style: italic;
  }
</style>
