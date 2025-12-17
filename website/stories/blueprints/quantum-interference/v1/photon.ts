import { Box2, MathUtils, Vector2 } from "three";

import { TWO_PI } from "@utils/three/math";
import Ray from "./ray";

export default class Photon {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public size: Vector2,
  ) {}

  drawRay() {}

  drawPhoton() {}

  draw() {
    this.drawPhoton();
  }
}
