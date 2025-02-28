import paper from "paper";
import { MathUtils } from "three";

import { createLine } from "@utils/paper/utils";
import { TWO_PI } from "@utils/three/math";
import { SketchSettings } from "../sketch/sketch";

export type HypatiaSettings = {
  blueprint: {};
  form: {
    earth: boolean;
    planets: boolean;
    planetsMaxRotation: number;
  };
};

function createElipse(
  radius: number,
  center,
  perspectiveFactorX,
  perspectiveFactorY,
  strokeColor,
  strokeWidth,
) {
  const path = new paper.Path.Ellipse({
    center: center,
    size: [radius * 2 * perspectiveFactorX, radius * 2 * perspectiveFactorY], // Making Y-axis shorter
    strokeColor,
    strokeWidth,
  });
  return path;
}

export function hypatia(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings & HypatiaSettings,
) {
  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  const col = new paper.Color(1, 1, 1, 0.5);

  if (settings.form.outline) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    form.addChild(path);
  }

  const M = 1 / Math.sqrt(3);

  // createElipse(radius, center, 1, M, col, settings.strokeWidth);
  createElipse(radius, center, M, 1, col, settings.strokeWidth);
  const l = createElipse(radius, center, M, 1, col, settings.strokeWidth);
  l.rotate(45);
  const r = createElipse(radius, center, M, 1, col, settings.strokeWidth);
  r.rotate(-45);

  const earthRadius = radius / 20;

  if (settings.form.earth) {
    const path = new paper.Path.Circle(center, earthRadius);
    // path.strokeColor = settings.strokeColor;
    path.fillColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth * 2;
    form.addChild(path);
  }

  // Space 7 concentril circles
  const total = 7;
  const minRadius = radius / 5;
  const maxRadius = radius * 1;

  const planetRadius = radius / 20;

  for (let i = 0; i < total; i++) {
    const p = i / (total - 1);
    const r = MathUtils.lerp(minRadius, maxRadius, p);

    const perspectiveFactorY = M; // ~0.577
    const perspectiveFactorX = 1; // Major axis remains 1

    const path = new paper.Path.Ellipse({
      center: center,
      size: [r * 2 * perspectiveFactorX, r * 2 * perspectiveFactorY], // Making Y-axis shorter
      strokeColor: settings.strokeColor,
      strokeWidth: settings.strokeWidth,
    });

    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    form.addChild(path);

    if (settings.form.planets) {
      const theta = p * TWO_PI * settings.form.planetsMaxRotation; // Evenly distribute planets along the ellipse

      // Compute planet position along the ellipse
      const planetX = center.x + Math.cos(theta) * r * perspectiveFactorX;
      const planetY = center.y + Math.sin(theta) * r * perspectiveFactorY;

      const planetPath = new paper.Path.Circle(
        new paper.Point(planetX, planetY),
        planetRadius,
      );
      planetPath.strokeColor = settings.strokeColor;
      planetPath.strokeWidth = settings.strokeWidth;
      form.addChild(planetPath);
    }
  }
}
