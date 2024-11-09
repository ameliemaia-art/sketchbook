import { PerspectiveCamera, Vector3 } from "three";

import { VECTOR_ONE, VECTOR_ZERO } from "./math";

/**
 * Position the camera and lookat the scene center
 *
 * @export
 * @param {PerspectiveCamera} camera
 * @param {number} [zoom=1]
 * @param {Vector3} [angle=VECTOR_ONE]
 */
export function resetCamera(
  camera: PerspectiveCamera,
  zoom = 1,
  angle: Vector3 = VECTOR_ONE,
) {
  camera.position.set(angle.x * zoom, angle.y * zoom, angle.z * zoom);
  camera.lookAt(VECTOR_ZERO);
}
