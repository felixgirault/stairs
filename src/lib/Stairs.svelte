<script lang="ts">
  import { Shape, Vector3 } from "three";
  import { Canvas, T } from "@threlte/core";
  import { Gizmo, OrbitControls } from "@threlte/extras";
  import NumberInput from "./NumberInput.svelte";
  import NumberDisplay from "./NumberDisplay.svelte";

  let angle = 25;
  let going = 0.245;
  let idealRaise = 0.175;
  let landingDepth = 1.8;
  let landingHeight = 0.2;
  let landingPostWidth = 0.15;
  let pivot = 0.5;
  let stairHeight = 1.6;
  let stairWidth = 0.95;
  let stepOverlap = 0.03;
  let stepThickness = 0.027;
  let stringOffset = 0.05;
  let stringThickness = 0.075;
  let stringWidth = 0.25;
  let longString = {} as StringSpec;
  let shortString = {} as StringSpec;
  let stepShapes = [] as Shape[];

  const rad = (deg: number) => deg * (Math.PI / 180);
  const deg = (rad: number) => rad * (180 / Math.PI);

  const stepShape = (index: number) => {
    const longWidth = longStairLength / stepCount;
    const shortWidth = shortStairLength / stepCount;
    const stepOffset = ((stepCount - index) / stepCount) * offset;

    const shape = new Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, longWidth + stepOverlap);
    shape.lineTo(stepWidth, shortWidth + stepOffset + stepOverlap);
    shape.lineTo(stepWidth, stepOffset);
    shape.lineTo(0, 0);
    return shape;
  };

  type StringSpec = {
    shape: Shape;
    floorLength: number;
    length: number;
    height: number;
  };

  const stringSpec = (length: number): StringSpec => {
    const stringAngle = Math.atan(stairHeight / length);
    const offsetX = stringOffset / Math.sin(stringAngle);
    const widthOffsetX = stringWidth / Math.sin(stringAngle);

    const floorLength = length + offsetX;
    const stringHeight =
      (floorLength / Math.sin(rad(90 - deg(stringAngle)))) *
      Math.sin(stringAngle);
    const widthOffsetY = stringWidth / Math.sin(rad(90 - deg(stringAngle)));

    const shape = new Shape();
    shape.moveTo(0, 0);
    shape.lineTo(-offsetX, 0);
    shape.lineTo(length - offsetX, stairHeight);
    shape.lineTo(length, stairHeight);
    shape.lineTo(length, stringHeight - widthOffsetY);
    shape.lineTo(widthOffsetX - offsetX, 0);
    shape.lineTo(0, 0);

    return {
      shape,
      floorLength,
      length: Math.sqrt(Math.pow(floorLength, 2) + Math.pow(stringHeight, 2)),
      height: stringHeight,
    };
  };

  const updateStringSpecs = () => {
    longString = stringSpec(longStairLength);
    shortString = stringSpec(shortStairLength);
  };

  const updateStepShapes = () => {
    stepShapes = Array(stepCount)
      .fill(0)
      .map((_, i) => stepShape(i));
  };

  $: stepWidth = stairWidth - 2 * stringThickness;
  $: stepCount = Math.round(stairHeight / idealRaise);
  $: raise = stairHeight / stepCount;
  $: blondelLength = 2 * raise + going;
  $: longGoing = longStairLength / stepCount;
  $: shortGoing = shortStairLength / stepCount;
  $: stairLengthAtPivot = stepCount * going;
  $: offset = (stepWidth / Math.sin(rad(90 - angle))) * Math.sin(rad(angle));
  $: longStairLength = stairLengthAtPivot + offset * pivot;
  $: shortStairLength = longStairLength - offset;
  $: longStairLength,
    shortStairLength,
    stringWidth,
    stringOffset,
    updateStringSpecs();
  $: stepCount, stepOverlap, angle, pivot, updateStepShapes();
</script>

<div class="container">
  <form>
    <label for="height">Height</label>
    <NumberInput name="height" bind:value={stairHeight} />

    <label for="raise">Raise</label>
    <NumberDisplay name="raise" value={raise} />

    <label for="going">Going</label>
    <div class="group">
      <NumberDisplay title="long" value={longGoing} />
      <NumberInput
        name="going"
        min={21}
        max={32}
        step={0.5}
        bind:value={going}
      />
      <NumberDisplay title="short" value={shortGoing} />
    </div>

    <label for="blondel">Blondel</label>
    <div class="group">
      <NumberDisplay title="long" value={2 * raise + longGoing} />
      <NumberDisplay
        name="blondel"
        min={60}
        max={64}
        bind:value={blondelLength}
      />
      <NumberDisplay title="short" value={2 * raise + shortGoing} />
    </div>

    <label for="overlap">Overlap</label>
    <NumberInput name="overlap" min={0} bind:value={stepOverlap} />

    <label for="angle">Floor angle</label>
    <NumberInput
      name="angle"
      multiplier={1}
      min={0}
      max={45}
      bind:value={angle}
    />

    <label for="pivot">Pivot</label>
    <div class="group">
      <NumberInput
        type="range"
        name="pivot"
        multiplier={1}
        min={0}
        max={1}
        step={0.05}
        bind:value={pivot}
      />
      <NumberDisplay title="position" value={pivot} />
    </div>

    <label for="stringWidth">String width</label>
    <NumberInput name="stringWidth" min={20} bind:value={stringWidth} />

    <label for="stringWidth">String offset</label>
    <NumberInput
      name="stringWidth"
      min={0}
      step={0.5}
      bind:value={stringOffset}
    />

    <p>String Length</p>
    <div class="group">
      <NumberDisplay title="long" value={longString.length} />
      <NumberDisplay title="short" value={shortString.length} />
    </div>

    <p>Floor length</p>
    <div class="group">
      <NumberDisplay title="long" value={longString.floorLength} />
      <NumberDisplay title="short" value={shortString.floorLength} />
    </div>
  </form>

  <div class="canvas">
    <Canvas>
      <T.PerspectiveCamera makeDefault position={[4, 3, 4]}>
        <OrbitControls
          enableDamping
          target={[stairWidth / 2, stairHeight / 2, stairLengthAtPivot / 2]}
        />
      </T.PerspectiveCamera>

      <T.DirectionalLight
        args={[0xffffff, 2]}
        position={[2, 3, 2]}
        castShadow
      />

      <T.Mesh rotation.x={rad(-90)} position={[0, -0.005, 0]} receiveShadow>
        <T.CircleGeometry args={[4, 400]} />
        <T.MeshStandardMaterial color="#66AC3A" />
      </T.Mesh>

      <T.Mesh position={[-0.1, 1.25, 0]} receiveShadow>
        <T.BoxGeometry args={[0.2, 2.5, 6]} />
        <T.MeshStandardMaterial color="#f2ece4" />
      </T.Mesh>

      <T.Mesh
        position={[
          stairWidth / 2,
          stairHeight - stepThickness - landingHeight / 2,
          -landingDepth / 2,
        ]}
        receiveShadow
        castShadow
      >
        <T.BoxGeometry args={[stairWidth, landingHeight, landingDepth]} />
        <T.MeshStandardMaterial color="#5a6064" />
      </T.Mesh>

      <T.Mesh
        position={[
          stairWidth - landingPostWidth / 2,
          (stairHeight - stepThickness) / 2,
          -landingPostWidth / 2,
        ]}
        receiveShadow
        castShadow
      >
        <T.BoxGeometry
          args={[
            landingPostWidth,
            stairHeight - stepThickness,
            landingPostWidth,
          ]}
        />
        <T.MeshStandardMaterial color="#5a6064" />
      </T.Mesh>

      <T.Mesh
        position={[
          stairWidth - landingPostWidth / 2,
          (stairHeight - stepThickness) / 2,
          landingPostWidth / 2 - landingDepth,
        ]}
        receiveShadow
        castShadow
      >
        <T.BoxGeometry
          args={[
            landingPostWidth,
            stairHeight - stepThickness,
            landingPostWidth,
          ]}
        />
        <T.MeshStandardMaterial color="#5a6064" />
      </T.Mesh>

      <T.Mesh
        position={[
          landingPostWidth / 2,
          (stairHeight - stepThickness) / 2,
          landingPostWidth / 2 - landingDepth,
        ]}
        receiveShadow
        castShadow
      >
        <T.BoxGeometry
          args={[
            landingPostWidth,
            stairHeight - stepThickness,
            landingPostWidth,
          ]}
        />
        <T.MeshStandardMaterial color="#5a6064" />
      </T.Mesh>

      <T.Mesh
        position={[
          landingPostWidth / 2,
          (stairHeight - stepThickness) / 2,
          -landingPostWidth / 2,
        ]}
        receiveShadow
        castShadow
      >
        <T.BoxGeometry
          args={[
            landingPostWidth,
            stairHeight - stepThickness,
            landingPostWidth,
          ]}
        />
        <T.MeshStandardMaterial color="#5a6064" />
      </T.Mesh>

      {#key stepShapes}
        {console.log("kljql")}
        <T.Line
          on:create={({ ref }) => {
            ref.computeLineDistances();
          }}
        >
          <T.BufferGeometry
            on:create={({ ref }) => {
              ref.setFromPoints([
                new Vector3(
                  stringThickness + stepWidth * pivot,
                  0,
                  stairLengthAtPivot
                ),
                new Vector3(
                  stringThickness + stepWidth * pivot,
                  stairHeight,
                  0
                ),
              ]);
            }}
          />

          <T.LineDashedMaterial
            color="lightgreen"
            dashSize={0.05}
            gapSize={0.05}
          />
        </T.Line>
      {/key}

      <T.Mesh
        position={[
          stairWidth / 2,
          stairHeight - stepThickness / 2,
          -landingDepth / 2,
        ]}
        receiveShadow
        castShadow
      >
        <T.BoxGeometry
          args={[stairWidth, stepThickness, landingDepth + 2 * stepOverlap]}
        />
        <T.MeshStandardMaterial color="#A1662F" />
      </T.Mesh>

      {#each stepShapes as shape, i}
        <T.Mesh
          rotation.x={rad(-90)}
          position={[
            stringThickness,
            i * raise - stepThickness,
            longStairLength - i * longGoing + stepOverlap,
          ]}
          receiveShadow
          castShadow
        >
          <T.ExtrudeGeometry
            args={[
              shape,
              { steps: 2, depth: stepThickness, bevelEnabled: false },
            ]}
          ></T.ExtrudeGeometry>
          <T.MeshStandardMaterial color="#A1662F" />
        </T.Mesh>
      {/each}

      <T.Mesh
        rotation.y={rad(90)}
        position={[0, 0, longStairLength]}
        receiveShadow
        castShadow
      >
        <T.ExtrudeGeometry
          args={[
            longString.shape,
            { steps: 2, depth: stringThickness, bevelEnabled: false },
          ]}
        ></T.ExtrudeGeometry>
        <T.MeshStandardMaterial color="#A1662F" />
      </T.Mesh>

      <T.Mesh
        rotation.y={rad(90)}
        position={[stairWidth - stringThickness, 0, shortStairLength]}
        receiveShadow
        castShadow
      >
        <T.ExtrudeGeometry
          args={[
            shortString.shape,
            { steps: 2, depth: stringThickness, bevelEnabled: false },
          ]}
        ></T.ExtrudeGeometry>
        <T.MeshStandardMaterial color="#A1662F" />
      </T.Mesh>

      <Gizmo />
    </Canvas>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row-reverse;
    width: 100vw;
    height: 100vh;
  }

  form {
    display: grid;
    grid-template-columns: auto auto;
    grid-auto-rows: min-content;
    gap: 0.5em 1ch;
    padding: 2lh;
  }

  .group {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .canvas {
    flex: 1;
    min-width: 0;
  }

  p {
    margin: 0;
  }
</style>
