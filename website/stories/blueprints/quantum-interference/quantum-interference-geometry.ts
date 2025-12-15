import paper from "paper";
import { MathUtils } from "three";
import { array } from "three/src/nodes/TSL.js";

import { TWO_PI } from "@utils/three/math";
import { createCircle, dot } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type QuantumInterferenceSettings = {
  blueprint: {};
  form: {};
};

export function quantumWave(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  waves: number,
  settings: SketchSettings & QuantumInterferenceSettings,
) {
  for (let i = 0; i < waves; i++) {
    const r = MathUtils.lerp(radius * 0.1, radius, i / (waves - 1));
    const path = new paper.Path.Circle(center, r);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);

    // Distribute points along the circle
    const numPoints = Math.round(r * 2);
    for (let j = 0; j < numPoints; j++) {
      const angle = (j / numPoints) * Math.PI * 2;

      for (let k = 0; k < 50; k++) {
        const r2 = MathUtils.lerp(r - 5, r + 5, Math.random());
        const x = center.x + r2 * Math.cos(angle);
        const y = center.y + r2 * Math.sin(angle);

        const pointOnCircle = new paper.Point(x, y);

        // Jitter the points slightly
        const jitterX = (Math.random() - 0.5) * 10;
        const jitterY = (Math.random() - 0.5) * 10;
        pointOnCircle.x += jitterX;
        pointOnCircle.y += jitterY;
        // A
        dot(pointOnCircle, 0.5, form, new paper.Color(1, 1, 1, 0.25));
      }
    }
  }
}

export function quantumInterference(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings & QuantumInterferenceSettings,
) {
  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  const emitters = 4;
  for (let i = 0; i < emitters; i++) {
    const angle = i * (TWO_PI / emitters);
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    const point = new paper.Point(x, y);
    quantumWave(blueprint, form, point, radius * 2, 10, settings);
  }
}

// 1 - create a function that draws x amount of concentric circles
