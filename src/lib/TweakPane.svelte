<script lang="ts">
  import { Folder, Pane } from "svelte-tweakpane-ui";
  import ScalableMonitor from "./ScalableMonitor.svelte";
  import ScalableSlider from "./ScalableSlider.svelte";
  import { stairs, type InputSpecs, type OutputSpecs } from "./specs";
  import type { Readable, Writable } from "svelte/store";

  export let input: Writable<InputSpecs>;
  export let output: Readable<OutputSpecs>;
</script>

<Pane title="Stairs specs" position="fixed">
  <ScalableSlider label="Height" bind:value={$input.stairHeight} />
  <ScalableSlider label="Width" bind:value={$input.stairWidth} />
  <ScalableSlider
    label="Going"
    min={0.01}
    step={0.005}
    bind:value={$input.going}
  />

  <ScalableSlider
    label="Ideal raise"
    min={0.01}
    step={0.005}
    bind:value={$input.idealRaise}
  />

  <ScalableMonitor label="Raise" value={$output.raise} />
  <ScalableMonitor label="Blondel" value={$output.pivotString.blondelLength} />
  <ScalableSlider
    label="Overlap"
    min={0}
    step={0.005}
    bind:value={$input.stepOverlap}
  />

  <ScalableSlider
    label="Floor angle"
    scale={1}
    min={0}
    max={45}
    step={0.5}
    bind:value={$input.floorAngle}
  />

  <ScalableSlider
    label="Pivot point"
    scale={1}
    min={0}
    max={1}
    step={0.05}
    bind:value={$input.pivot}
  />

  <ScalableSlider
    label="String width"
    min={0.1}
    bind:value={$input.stringWidth}
  />

  <ScalableSlider
    label="String offset"
    min={0}
    max={$input.stringWidth}
    step={0.005}
    bind:value={$input.stringOffset}
  />

  <Folder expanded title="Long">
    <ScalableMonitor label="Going" value={$output.longString.going} />
    <ScalableMonitor label="Blondel" value={$output.longString.blondelLength} />
    <ScalableMonitor label="String length" value={$output.longString.length} />
    <ScalableMonitor
      label="Floor length"
      value={$output.longString.floorLength}
    />
  </Folder>

  <Folder expanded title="Short">
    <ScalableMonitor label="Going" value={$output.shortString.going} />
    <ScalableMonitor
      label="Blondel"
      value={$output.shortString.blondelLength}
    />
    <ScalableMonitor label="String length" value={$output.shortString.length} />
    <ScalableMonitor
      label="Floor length"
      value={$output.shortString.floorLength}
    />
  </Folder>
</Pane>
