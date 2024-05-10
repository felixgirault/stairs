export const rad = (deg: number) => deg * (Math.PI / 180);
export const deg = (rad: number) => rad * (180 / Math.PI);

export const hypotenuse = (x: number, y: number) =>
  Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
