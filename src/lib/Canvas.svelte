<script lang="ts">
  import { Canvas, T } from "@threlte/core";
  import { Gizmo, OrbitControls } from "@threlte/extras";
  import { type Readable } from "svelte/store";
  import DashedLine from "./DashedLine.svelte";
  import { rad } from "./math";
  import { stepShape, stringShape } from "./shapes";
  import { type InputSpecs, type OutputSpecs } from "./specs";

  export let input: Readable<InputSpecs>;
  export let output: Readable<OutputSpecs>;

  const floorHeight = -0.001;

  $: structureLength = $output.longString.floorLength + $input.landingLength;
  $: padding = $input.stairWidth;
  $: floorLength = structureLength + 2 * padding;
  $: floorOffset = structureLength / 2 - $input.landingLength;
  $: wallHeight = $input.stairHeight + padding;
  $: longString = stringShape($input, $output.longString);
  $: shortString = stringShape($input, $output.shortString);
  $: stepShapes = Array($output.stepCount)
    .fill(0)
    .map((_, i) => stepShape($input, $output, i));
</script>

<div class="canvas">
  <Canvas>
    <T.PerspectiveCamera makeDefault position={[5, 3, 3]}>
      <OrbitControls
        enableDamping
        target={[
          $input.stairWidth / 2,
          $input.stairHeight / 2,
          $output.pivotString.floorLength / 2,
        ]}
      />
    </T.PerspectiveCamera>

    <T.DirectionalLight
      args={[0xffffff, 1.6]}
      position={[2, 3, 2]}
      castShadow
    />

    <T.Mesh
      rotation.x={rad(-90)}
      rotation.z={rad(-90)}
      position={[0, floorHeight, floorOffset]}
      receiveShadow
    >
      <T.CircleGeometry args={[floorLength / 2, 400, 0, Math.PI]} />
      <T.MeshStandardMaterial color="#eeebd9" />
    </T.Mesh>

    <T.Mesh
      rotation.x={rad(90)}
      rotation.y={rad(90)}
      rotation.z={rad(-90)}
      position.y={floorHeight + wallHeight / 2}
      position.z={floorOffset}
      receiveShadow
    >
      <T.PlaneGeometry args={[floorLength, wallHeight]} />
      <T.MeshStandardMaterial color="#eeebd9" />
    </T.Mesh>

    <T.Mesh
      position={[
        $input.stairWidth / 2,
        $input.stairHeight - $input.stepThickness - $input.landingHeight / 2,
        -$input.landingLength / 2,
      ]}
      receiveShadow
      castShadow
    >
      <T.BoxGeometry
        args={[$input.stairWidth, $input.landingHeight, $input.landingLength]}
      />
      <T.MeshStandardMaterial color="#eeebd9" />
    </T.Mesh>

    {#key stepShapes}
      <DashedLine
        from={[
          $input.stringThickness + $output.stepWidth * $input.pivot,
          0,
          $output.pivotString.floorLength,
        ]}
        to={[
          $input.stringThickness + $output.stepWidth * $input.pivot,
          $input.stairHeight,
          0,
        ]}
      />

      <DashedLine
        from={[0, -floorHeight, $output.pivotString.floorLength]}
        to={[$input.stairWidth, -floorHeight, $output.pivotString.floorLength]}
      />
    {/key}

    <T.Mesh
      position={[
        $input.stairWidth / 2,
        $input.stairHeight - $input.stepThickness / 2,
        -$input.landingLength / 2,
      ]}
      receiveShadow
      castShadow
    >
      <T.BoxGeometry
        args={[
          $input.stairWidth,
          $input.stepThickness,
          $input.landingLength + 2 * $input.stepOverlap,
        ]}
      />
      <T.MeshStandardMaterial color="#A1662F" />
    </T.Mesh>

    {#each stepShapes as shape, i}
      <T.Mesh
        rotation.x={rad(-90)}
        position={[
          $input.stringThickness,
          i * $output.raise - $input.stepThickness,
          $output.longString.floorLength -
            i * $output.longString.going +
            $input.stepOverlap,
        ]}
        receiveShadow
        castShadow
      >
        <T.ExtrudeGeometry
          args={[
            shape,
            { steps: 2, depth: $input.stepThickness, bevelEnabled: false },
          ]}
        ></T.ExtrudeGeometry>
        <T.MeshStandardMaterial color="#A1662F" />
      </T.Mesh>
    {/each}

    <T.Mesh
      rotation.y={rad(90)}
      position={[0, 0, $output.longString.floorLength]}
      receiveShadow
      castShadow
    >
      <T.ExtrudeGeometry
        args={[
          longString,
          { steps: 2, depth: $input.stringThickness, bevelEnabled: false },
        ]}
      ></T.ExtrudeGeometry>
      <T.MeshStandardMaterial color="#A1662F" />
    </T.Mesh>

    <T.Mesh
      rotation.y={rad(90)}
      position={[
        $input.stairWidth - $input.stringThickness,
        0,
        $output.shortString.floorLength,
      ]}
      receiveShadow
      castShadow
    >
      <T.ExtrudeGeometry
        args={[
          shortString,
          { steps: 2, depth: $input.stringThickness, bevelEnabled: false },
        ]}
      ></T.ExtrudeGeometry>
      <T.MeshStandardMaterial color="#A1662F" />
    </T.Mesh>

    <Gizmo />
  </Canvas>
</div>

<style>
  .canvas {
    width: 100vw;
    height: 100vh;
  }
</style>
