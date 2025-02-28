import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, lerp } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type MerkabaSettings = {
  blueprint: {
    architecture: boolean;
  };
  form: {
    masculinity: boolean;
    femininity: boolean;
    union: boolean;
  };
};

export function merkaba(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings & MerkabaSettings,
) {
  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  // Line from center
  let total = 6;
  let innerRadius = radius / 3;
  const outlineRadius = radius - innerRadius;

  const startAngle = -Math.PI / 6;

  if (settings.blueprint.architecture) {
    createCircle(
      center,
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      undefined,
      blueprint,
    );
  }

  const points: paper.Point[] = [];
  for (let i = 0; i < total; i++) {
    const theta = startAngle + (TWO_PI / total) * i;
    const x = center.x + Math.cos(theta) * outlineRadius;
    const y = center.y + Math.sin(theta) * outlineRadius;
    points.push(new paper.Point(x, y));
    if (settings.blueprint.architecture) {
      createCircle(
        points[i],
        innerRadius,
        settings.strokeColor,
        settings.strokeWidth,
        undefined,
        blueprint,
      );
    }
  }

  if (settings.form.femininity) {
    createLine(
      [points[0], points[2], points[4], points[0]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  if (settings.form.masculinity) {
    // Top
    createLine(
      [points[5], lerp(points[4], points[0], (1 / 3) * 2)],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[5], lerp(points[4], points[0], 1 / 3)],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );

    // Right
    createLine(
      [points[1], lerp(points[0], points[2], 1 / 3)],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[1], lerp(points[0], points[2], (1 / 3) * 2)],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );

    // Left
    createLine(
      [points[3], lerp(points[2], points[4], 1 / 3)],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[3], lerp(points[2], points[4], (1 / 3) * 2)],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  if (settings.form.union) {
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
      form,
    );

    createLine(
      [points[5], center],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[1], center],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[3], center],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }
}
