import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type FruitOfLifeSettings = {
  blueprint: {
    cosmos: boolean;
  };
  form: {
    creation: boolean;
  };
};

export function fruitOfLife(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings,
) {
  const group = new paper.Group();
  const total = 6;
  const innerRadius = radius / 5;
  const startAngle = -Math.PI / 6;

  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  if (settings.form.creation) {
    createCircle(
      center,
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      undefined,
      form,
    );
  }

  if (settings.form.architecture) {
    const dimensions = 2;
    for (let i = 0; i < dimensions; i++) {
      const outlineRadius = innerRadius * 2 * (i + 1);
      for (let j = 0; j < total; j++) {
        const theta = startAngle + (TWO_PI / total) * j;
        const x = center.x + Math.cos(theta) * outlineRadius;
        const y = center.y + Math.sin(theta) * outlineRadius;
        createCircle(
          new paper.Point(x, y),
          innerRadius,
          settings.strokeColor,
          settings.strokeWidth,
          undefined,
          form,
        );
      }
    }
  }

  return group;
}
