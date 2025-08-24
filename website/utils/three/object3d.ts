import { Box3, Object3D, Vector3 } from "three";

export function stack(object0: Object3D, object1: Object3D) {
  const box = new Box3();
  box.setFromObject(object0);
  const size = new Vector3();
  box.getSize(size);
  object1.position.y = size.y;
}
