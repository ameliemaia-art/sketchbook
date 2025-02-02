import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type MetatronsCubeSettings = {
  blueprint: {};
  form: {
    creation: boolean;
    architecture: boolean;
    structure: boolean;
    masculinity: boolean;
    femininity: boolean;
    interconnectedness: boolean;
  };
};

export function metatronsCube(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings & MetatronsCubeSettings,
) {
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
      form,
    );
  }

  const dimensions = 2;
  const points: paper.Point[][] = [];
  for (let i = 0; i < dimensions; i++) {
    const outlineRadius = innerRadius * 2 * (i + 1);
    points[i] = [];
    for (let j = 0; j < total; j++) {
      const theta = startAngle + (TWO_PI / total) * j;
      const x = center.x + Math.cos(theta) * outlineRadius;
      const y = center.y + Math.sin(theta) * outlineRadius;
      points[i].push(new paper.Point(x, y));

      // Draw text labels for each point
      // const text = new paper.PointText(new paper.Point(x, y));
      // text.content = `${j}`;
      // text.style.fontSize = 20;
      // text.style.fillColor = new paper.Color(1, 0, 0);
      // group.addChild(text);

      if (settings.form.architecture) {
        createCircle(
          new paper.Point(x, y),
          innerRadius,
          settings.strokeColor,
          settings.strokeWidth,
          form,
        );
      }
    }

    if (settings.form.structure) {
      const line = new paper.Path([...points[i], points[i][0]]);
      line.strokeColor = settings.strokeColor;
      line.strokeWidth = settings.strokeWidth;
      form.addChild(line);
    }

    // Upwards triangle
    if (settings.form.masculinity) {
      const upwardsTriangle = new paper.Path([
        points[i][1],
        points[i][3],
        points[i][5],
        points[i][1],
      ]);
      upwardsTriangle.strokeColor = settings.strokeColor;
      upwardsTriangle.strokeWidth = settings.strokeWidth;
      form.addChild(upwardsTriangle);
    }

    if (settings.form.femininity) {
      const downwardsTriangle = new paper.Path([
        points[i][0],
        points[i][2],
        points[i][4],
        points[i][0],
      ]);
      downwardsTriangle.strokeColor = settings.strokeColor;
      downwardsTriangle.strokeWidth = settings.strokeWidth;
      form.addChild(downwardsTriangle);
    }
  }

  if (settings.form.interconnectedness) {
    // Draw lines between outer circles and inner circles
    for (let j = 0; j < 6; j++) {
      const p0 = (j + 2) % points[0].length;
      const p1 = (j + 3) % points[0].length;
      const p2 = (j + 4) % points[0].length;
      const line0 = new paper.Path([points[1][j], points[0][p0]]);
      line0.strokeColor = settings.strokeColor;
      line0.strokeWidth = settings.strokeWidth;
      const line1 = new paper.Path([points[1][j], points[0][p1]]);
      line1.strokeColor = settings.strokeColor;
      line1.strokeWidth = settings.strokeWidth;
      const line2 = new paper.Path([points[1][j], points[0][p2]]);
      line2.strokeColor = settings.strokeColor;
      line2.strokeWidth = settings.strokeWidth;
      form.addChild(line0);
      form.addChild(line1);
      form.addChild(line2);
    }
  }
}
