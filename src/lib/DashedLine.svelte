<script lang="ts">
  import { T } from "@threlte/core";
  import { Vector3 } from "three";

  type Point = [x: number, y: number, z: number];

  export let from: Point;
  export let to: Point;
</script>

<T.Line
  on:create={({ ref }) => {
    ref.computeLineDistances();
  }}
>
  <T.BufferGeometry
    on:create={({ ref }) => {
      ref.setFromPoints([new Vector3(...from), new Vector3(...to)]);
    }}
  />

  <T.LineDashedMaterial color="black" dashSize={0.05} gapSize={0.05} />
</T.Line>
