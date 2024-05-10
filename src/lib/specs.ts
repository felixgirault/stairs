import { derived, writable } from "svelte/store";
import { hypotenuse, rad } from "./math";

export type InputSpecs = {
  stairWidth: number;
  stairHeight: number;
  idealRaise: number;
  floorAngle: number;
  pivot: number;
  going: number;
  stepThickness: number;
  stepOverlap: number;
  stringWidth: number;
  stringThickness: number;
  stringOffset: number;
  landingLength: number;
  landingHeight: number;
};

export type OutputStringSpecs = {
  floorLength: number;
  length: number;
  going: number;
  blondelLength: number;
};

export type OutputSpecs = {
  raise: number;
  stepCount: number;
  stepWidth: number;
  longString: OutputStringSpecs;
  pivotString: OutputStringSpecs;
  shortString: OutputStringSpecs;
};

export const stairs = () => {
  const input = writable<InputSpecs>({
    stairHeight: 1.6,
    stairWidth: 0.95,
    idealRaise: 0.175,
    floorAngle: 25,
    pivot: 0.5,
    going: 0.245,
    stepThickness: 0.027,
    stepOverlap: 0.03,
    stringWidth: 0.25,
    stringThickness: 0.075,
    stringOffset: 0.05,
    landingLength: 1.8,
    landingHeight: 0.3,
  });

  const output = derived(input, (specs) => {
    const stepCount = Math.round(specs.stairHeight / specs.idealRaise);
    const stepWidth = specs.stairWidth - 2 * specs.stringThickness;
    const raise = specs.stairHeight / stepCount;
    const floorLength = stepCount * specs.going;
    const offset =
      (stepWidth / Math.sin(rad(90 - specs.floorAngle))) *
      Math.sin(rad(specs.floorAngle));
    const longFloorLength = floorLength + offset * specs.pivot;
    const shortFloorLength = longFloorLength - offset;
    const longGoing = longFloorLength / stepCount;
    const shortGoing = shortFloorLength / stepCount;

    return {
      raise,
      stepCount,
      stepWidth,
      pivotString: {
        floorLength,
        length: hypotenuse(floorLength, specs.stairHeight),
        going: specs.going,
        blondelLength: 2 * raise + specs.going,
      },
      longString: {
        floorLength: longFloorLength,
        length: hypotenuse(longFloorLength, specs.stairHeight),
        going: longGoing,
        blondelLength: 2 * raise + longGoing,
      },
      shortString: {
        floorLength: shortFloorLength,
        length: hypotenuse(shortFloorLength, specs.stairHeight),
        going: shortGoing,
        blondelLength: 2 * raise + shortGoing,
      },
    } satisfies OutputSpecs;
  });

  return { input, output };
};
