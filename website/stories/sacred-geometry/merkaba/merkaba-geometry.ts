import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, lerp } from "../utils";

export function merkaba(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  outlineVisible = false,
  circlesVisible = false,
  masculinity = false,
  femininity = false,
  unity = false,
  interconnectedness = false,
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
  let innerRadius = radius / 3;
  const outlineRadius = radius - innerRadius;

  const startAngle = -Math.PI / 6;

  if (circlesVisible) {
    createCircle(center, innerRadius, strokeColor, strokeWidth, group);
  }

  const points: paper.Point[] = [];
  for (let i = 0; i < total; i++) {
    const theta = startAngle + (TWO_PI / total) * i;
    const x = center.x + Math.cos(theta) * outlineRadius;
    const y = center.y + Math.sin(theta) * outlineRadius;
    points.push(new paper.Point(x, y));
    if (circlesVisible) {
      createCircle(points[i], innerRadius, strokeColor, strokeWidth, group);
    }
  }

  if (femininity) {
    createLine(
      [points[0], points[2], points[4], points[0]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  if (masculinity) {
    // Top
    createLine(
      [points[5], lerp(points[4], points[0], (1 / 3) * 2)],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [points[5], lerp(points[4], points[0], 1 / 3)],
      strokeColor,
      strokeWidth,
      group,
    );

    // Right
    createLine(
      [points[1], lerp(points[0], points[2], 1 / 3)],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [points[1], lerp(points[0], points[2], (1 / 3) * 2)],
      strokeColor,
      strokeWidth,
      group,
    );

    // Left
    createLine(
      [points[3], lerp(points[2], points[4], 1 / 3)],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [points[3], lerp(points[2], points[4], (1 / 3) * 2)],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  if (unity) {
    // Middle
    createLine(
      [
        lerp(points[4], points[0], 0.5),
        lerp(points[0], points[2], 0.5),
        lerp(points[2], points[4], 0.5),
        lerp(points[4], points[0], 0.5),
      ],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  // Lines
  if (interconnectedness) {
    createLine([points[5], center], strokeColor, strokeWidth, group);
    createLine([points[1], center], strokeColor, strokeWidth, group);
    createLine([points[3], center], strokeColor, strokeWidth, group);
  }

  return group;
}
