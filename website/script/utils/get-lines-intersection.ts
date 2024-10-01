/**
 * Calculates the intersection point of two lines given their coordinates.
 *
 * @param {number} x1 - The x-coordinate of the first point of the first line.
 * @param {number} y1 - The y-coordinate of the first point of the first line.
 * @param {number} x2 - The x-coordinate of the second point of the first line.
 * @param {number} y2 - The y-coordinate of the second point of the first line.
 * @param {number} x3 - The x-coordinate of the first point of the second line.
 * @param {number} y3 - The y-coordinate of the first point of the second line.
 * @param {number} x4 - The x-coordinate of the second point of the second line.
 * @param {number} y4 - The y-coordinate of the second point of the second line.
 *
 * @returns {Array<number>|null} An array containing the x and y coordinates of the intersection point, or null if the lines do not intersect.
 */
export function getLinesIntersection(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): [number, number]|null {
  const denom: number = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denom === 0) return null;
  const t: number = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u: number = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    const intersectX: number = x1 + t * (x2 - x1);
    const intersectY: number = y1 + t * (y2 - y1);
    return [intersectX, intersectY];
  }
  return null;
}
