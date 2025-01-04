import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export function eggOfLife(
  center: paper.Point,
  radius: number,
  settings: SketchSettings,
) {
  const group = new paper.Group();

  if (settings.layers.outline) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    group.addChild(path);
  }

  // Line from center
  const total = 6;
  const innerRadius = radius / 3;
  const outlineRadius = radius - innerRadius;
  const startAngle = -Math.PI / 6;

  createCircle(
    center,
    innerRadius,
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );

  for (let i = 0; i < total; i++) {
    const theta = startAngle + (TWO_PI / total) * i;
    const x = center.x + Math.cos(theta) * outlineRadius;
    const y = center.y + Math.sin(theta) * outlineRadius;
    createCircle(
      new paper.Point(x, y),
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  return group;
}
