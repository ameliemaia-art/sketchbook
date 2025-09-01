import { getGeometryDimensions } from "@/stories/forms/column/geometry/column-echinus-geometry";
import {
  Box3,
  Box3Helper,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
  Vector3,
} from "three";

export function stack(object0: Object3D, object1: Object3D) {
  object0.updateMatrixWorld(true);
  const box = new Box3();
  box.setFromObject(object0);
  const size = new Vector3();
  box.getSize(size);
  object1.position.y = size.y;
}

/**
 * Automatically stacks multiple objects vertically in sequence
 * @param objects Array of objects to stack, first object stays at origin
 */
export function stackSequential(...objects: (Object3D | undefined | null)[]) {
  // Filter out undefined/null objects
  const validObjects = objects.filter((obj): obj is Object3D => obj != null);

  if (validObjects.length < 2) return;

  for (let i = 1; i < validObjects.length; i++) {
    const previousObject = validObjects[i - 1];
    const currentObject = validObjects[i];

    // Safety check - ensure both objects exist
    if (!previousObject || !currentObject) continue;

    // Update the previous object's matrix world
    previousObject.updateMatrixWorld(true);

    // Get the bounding box of the previous object
    const box = new Box3().setFromObject(previousObject);
    const size = new Vector3();
    box.getSize(size);

    // Position current object on top of previous object
    currentObject.position.y = previousObject.position.y + size.y;
  }
}

/**
 * Adds objects to a group and automatically stacks them vertically
 * @param group The group to add objects to
 * @param objects Objects to add and stack (undefined/null objects are filtered out)
 */
export function addAndStack(
  group: Object3D,
  ...objects: (Object3D | undefined | null)[]
) {
  // Filter out undefined/null objects
  const validObjects = objects.filter((obj): obj is Object3D => obj != null);

  // Add all valid objects to the group first
  validObjects.forEach((obj) => group.add(obj));

  // Then stack them
  stackSequential(...validObjects);
}

export function boundingBox(object: Object3D) {
  return new Box3Helper(new Box3().setFromObject(object), 0x00ff00);
}

const pointGeometry = new SphereGeometry(0.1, 16, 16);
const pointMaterial = new MeshBasicMaterial({ color: 0xffffff });

export function createPoint(
  radius = 1,
  position = new Vector3(),
  debug = false,
) {
  let object: Mesh | Object3D;
  if (debug) {
    object = new Mesh(pointGeometry, pointMaterial);
    object.scale.setScalar(radius);
    object.position.copy(position);
  } else {
    object = new Object3D();
    object.position.copy(position);
  }
  return object;
}

export function centerGeometry(geometry: BufferGeometry) {
  const dimensions = getGeometryDimensions(geometry);
  geometry.translate(
    -dimensions.center.x,
    -dimensions.center.y,
    -dimensions.center.z,
  );
}
