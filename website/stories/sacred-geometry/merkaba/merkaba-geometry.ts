import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, lerp } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type MerkabaSettings = {
  divisions: number;
  layers: {
    background: boolean;
    outline: boolean;
    circles: boolean;
    masculinity: boolean;
    femininity: boolean;
    unity: boolean;
    interconnectedness: boolean;
  };
};

export function merkaba(
  center: paper.Point,
  radius: number,
  settings: SketchSettings & MerkabaSettings,
) {
  const group = new paper.Group();

  if (settings.layers.outline) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    group.addChild(path);
  }

  // Line from center
  let total = 6;
  let innerRadius = radius / 3;
  const outlineRadius = radius - innerRadius;

  const startAngle = -Math.PI / 6;

  if (settings.layers.circles) {
    createCircle(
      center,
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  const points: paper.Point[] = [];
  for (let i = 0; i < total; i++) {
    const theta = startAngle + (TWO_PI / total) * i;
    const x = center.x + Math.cos(theta) * outlineRadius;
    const y = center.y + Math.sin(theta) * outlineRadius;
    points.push(new paper.Point(x, y));
    if (settings.layers.circles) {
      createCircle(
        points[i],
        innerRadius,
        settings.strokeColor,
        settings.strokeWidth,
        group,
      );
    }
  }

  if (settings.layers.femininity) {
    createLine(
      [points[0], points[2], points[4], points[0]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.masculinity) {
    // Top
    createLine(
      [points[5], lerp(points[4], points[0], (1 / 3) * 2)],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [points[5], lerp(points[4], points[0], 1 / 3)],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    // Right
    createLine(
      [points[1], lerp(points[0], points[2], 1 / 3)],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [points[1], lerp(points[0], points[2], (1 / 3) * 2)],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    // Left
    createLine(
      [points[3], lerp(points[2], points[4], 1 / 3)],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [points[3], lerp(points[2], points[4], (1 / 3) * 2)],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.unity) {
    // Middle
    createLine(
      [
        lerp(points[4], points[0], 0.5),
        lerp(points[0], points[2], 0.5),
        lerp(points[2], points[4], 0.5),
        lerp(points[4], points[0], 0.5),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  // Lines
  if (settings.layers.interconnectedness) {
    createLine(
      [points[5], center],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [points[1], center],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [points[3], center],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  return group;
}
