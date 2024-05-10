<script lang="ts">
  import { Monitor } from "svelte-tweakpane-ui";

  export let scale = 100;
  export let value = 0;
</script>

<Monitor {...$$restProps} value={value * scale} />
