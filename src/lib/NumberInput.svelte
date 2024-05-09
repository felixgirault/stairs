<script lang="ts">
  export let multiplier = 100;
  export let value = 0;

  let val = value * multiplier;

  $: value = val / multiplier;
</script>

<input type="number" {...$$restProps} bind:value={val} />
