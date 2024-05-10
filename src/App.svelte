<script lang="ts">
  import Canvas from "./lib/Canvas.svelte";
  import TweakPane from "./lib/TweakPane.svelte";
  import { stairs } from "./lib/specs";

  const specs = stairs();
</script>

<main>
  <TweakPane input={specs.input} output={specs.output} />
  <Canvas input={specs.input} output={specs.output} />
</main>
