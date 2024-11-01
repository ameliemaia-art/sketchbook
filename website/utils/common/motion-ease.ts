import { Vector2, Vector3 } from "three";

const EASE_THRESHOLD = 0.0001;

/**
 *
 *
 * @export
 * @class MotionEase
 */
export class MotionEase2D {
  value = new Vector2();
  newValue = new Vector2();
  easing = 0.025;

  setValue = (valueX: number, valueY: number, ease: boolean = true) => {
    this.newValue.x = valueX;
    this.newValue.y = valueY;

    if (!ease) {
      this.value.x = this.newValue.x;
      this.value.y = this.newValue.y;
    }
  };

  update = () => {
    this.value.x += (this.newValue.x - this.value.x) * this.easing;
    this.value.y += (this.newValue.y - this.value.y) * this.easing;

    if (Math.abs(this.value.x - this.newValue.x) < EASE_THRESHOLD) {
      this.value.x = this.newValue.x;
    }
    if (Math.abs(this.value.y - this.newValue.y) < EASE_THRESHOLD) {
      this.value.y = this.newValue.y;
    }
  };
}
