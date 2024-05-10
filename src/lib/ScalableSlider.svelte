<script lang="ts">
  import { Slider } from "svelte-tweakpane-ui";

  export let scale = 100;
  export let value = 0;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let step: number | undefined = undefined;

  const scaledValue = (v?: number) =>
    typeof v === "number" ? v * scale : undefined;

  let val = value * scale;

  $: value = val / scale;
</script>

<Slider
  {...$$restProps}
  min={scaledValue(min)}
  max={scaledValue(max)}
  step={scaledValue(step)}
  bind:value={val}
/>
