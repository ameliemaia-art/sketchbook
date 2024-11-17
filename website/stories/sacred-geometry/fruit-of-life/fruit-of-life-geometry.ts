import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle } from "../utils";

export function fruitOfLife(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  outlineVisible = false,
) {
  const group = new paper.Group();

  if (outlineVisible) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = strokeColor;
    path.strokeWidth = strokeWidth;
    group.addChild(path);
  }

  // Line from center
  let total = 6;
  let innerRadius = radius / 5;

  const startAngle = -Math.PI / 6;

  createCircle(center, innerRadius, strokeColor, strokeWidth, group);

  const dimensions = 2;
  for (let i = 0; i < dimensions; i++) {
    const outlineRadius = innerRadius * 2 * (i + 1);
    for (let i = 0; i < total; i++) {
      const theta = startAngle + (TWO_PI / total) * i;
      const x = center.x + Math.cos(theta) * outlineRadius;
      const y = center.y + Math.sin(theta) * outlineRadius;
      createCircle(
        new paper.Point(x, y),
        innerRadius,
        strokeColor,
        strokeWidth,
        group,
      );
    }
  }

  return group;
}
