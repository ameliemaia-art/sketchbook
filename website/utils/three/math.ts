import { Euler, MathUtils, Matrix4, Vector3 } from "three";

export const TWO_PI = Math.PI * 2;
export const PI = Math.PI;
export const HALF_PI = Math.PI / 2;
export const QUARTER_PI = Math.PI / 4;
export const VECTOR_ZERO = new Vector3();
export const VECTOR_ONE = new Vector3(1, 1, 1);
export const VECTOR_UP = new Vector3(0, 1, 0);
export const EULER_ZERO = new Euler(0, 0, 0);

export function randomSpherePoint(
  x0: number,
  y0: number,
  z0: number,
  radius: number,
  position: Vector3,
) {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  position.x = x0 + radius * Math.sin(phi) * Math.cos(theta);
  position.y = y0 + radius * Math.sin(phi) * Math.sin(theta);
  position.z = z0 + radius * Math.cos(phi);
}

export function getFovFromProjectionMatrix(projectionMatrix: Matrix4) {
  return (
    Math.atan(1.0 / projectionMatrix.elements[5]) * 2.0 * MathUtils.RAD2DEG
  );
}

export function getScaleFromCamera(
  projectionMatrix: Matrix4,
  aspect: number,
  distance: number,
) {
  const scaleY =
    Math.tan(
      ((getFovFromProjectionMatrix(projectionMatrix) * Math.PI) / 180) * 0.5,
    ) *
    (distance * 2);
  return {
    scaleX: scaleY * aspect,
    scaleY,
  };
}
