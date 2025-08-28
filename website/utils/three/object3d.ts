import { Box3, Box3Helper, Object3D, Vector3 } from "three";

export function stack(object0: Object3D, object1: Object3D) {
  object0.updateMatrixWorld();
  const box = new Box3();
  box.setFromObject(object0);
  const size = new Vector3();
  box.getSize(size);
  object1.position.y = size.y;
}

export function boundingBox(object: Object3D) {
  return new Box3Helper(new Box3().setFromObject(object), 0x00ff00);
}
