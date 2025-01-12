import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type EggOfLifeSettings = {
  blueprint: {};
  form: {
    seed: boolean;
    petals: boolean;
  };
};

export function eggOfLife(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings & EggOfLifeSettings,
) {
  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  // Line from center
  const total = 6;
  const innerRadius = radius / 3;
  const outlineRadius = radius - innerRadius;
  const startAngle = -Math.PI / 6;

  // Center Circle
  if (settings.form.seed) {
    createCircle(
      center,
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  // Outer Circles
  if (settings.form.petals) {
    for (let i = 0; i < total; i++) {
      const theta = startAngle + (TWO_PI / total) * i;
      const x = center.x + Math.cos(theta) * outlineRadius;
      const y = center.y + Math.sin(theta) * outlineRadius;
      createCircle(
        new paper.Point(x, y),
        innerRadius,
        settings.strokeColor,
        settings.strokeWidth,
        form,
      );
    }
  }
}
