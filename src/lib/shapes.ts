import { Shape } from "three";
import { deg, rad } from "./math";
import type { InputSpecs, OutputSpecs, OutputStringSpecs } from "./specs";

export const stringShape = (
  input: InputSpecs,
  output: OutputStringSpecs
): Shape => {
  const angle = Math.atan(input.stairHeight / output.floorLength);
  const offsetX = input.stringOffset / Math.sin(angle);
  const floorLength = output.floorLength + offsetX;
  const height =
    (floorLength / Math.sin(rad(90 - deg(angle)))) * Math.sin(angle);
  const widthOffsetX = input.stringWidth / Math.sin(angle);
  const widthOffsetY = input.stringWidth / Math.sin(rad(90 - deg(angle)));

  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(-offsetX, 0);
  shape.lineTo(output.floorLength - offsetX, input.stairHeight);
  shape.lineTo(output.floorLength, input.stairHeight);
  shape.lineTo(output.floorLength, height - widthOffsetY);
  shape.lineTo(widthOffsetX - offsetX, 0);
  shape.lineTo(0, 0);

  return shape;
};

export const stepShape = (
  input: InputSpecs,
  output: OutputSpecs,
  index: number
) => {
  const offset = output.longString.floorLength - output.shortString.floorLength;
  const longWidth = output.longString.floorLength / output.stepCount;
  const shortWidth = output.shortString.floorLength / output.stepCount;
  const stepOffset = ((output.stepCount - index) / output.stepCount) * offset;

  const shape = new Shape();
  shape.moveTo(0, 0);
  // @todo fix overlap (calc with direction)
  shape.lineTo(0, longWidth + input.stepOverlap);
  shape.lineTo(output.stepWidth, shortWidth + stepOffset + input.stepOverlap);
  shape.lineTo(output.stepWidth, stepOffset);
  shape.lineTo(0, 0);
  return shape;
};
