/**
 * Linearly interpolates between start and end values by a given alpha.
 */
export const lerp = (start: number, end: number, amt: number): number => {
  return (1 - amt) * start + amt * end;
};

/**
 * Clamps a number between a minimum and maximum boundary.
 */
export const clamp = (val: number, min: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
};

/**
 * Computes Euclidean distance between two 2D vector coordinate points.
 */
export interface Point2D {
  x: number;
  y: number;
}

export const getDistance = (p1: Point2D, p2: Point2D): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Computes the angle in radians between two coordinate points.
 */
export const getAngle = (p1: Point2D, p2: Point2D): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

/**
 * Maps a value from an input range to a corresponding output range.
 */
export const mapRange = (
  val: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return outMin + ((val - inMin) * (outMax - outMin)) / (inMax - inMin);
};
