import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type MetatronsCubeSettings = {
  layers: {
    background: boolean;
    outline: boolean;
    creation: boolean;
    structure: boolean;
    masculinity: boolean;
    femininity: boolean;
    interconnectedness: boolean;
  };
};

export function metatronsCube(
  center: paper.Point,
  radius: number,
  settings: SketchSettings & MetatronsCubeSettings,
) {
  const group = new paper.Group();
  const total = 6;
  const innerRadius = radius / 5;
  const startAngle = -Math.PI / 6;

  if (settings.layers.outline) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    group.addChild(path);
  }

  if (settings.layers.creation) {
    createCircle(
      center,
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      group,
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

      if (settings.layers.creation) {
        createCircle(
          new paper.Point(x, y),
          innerRadius,
          settings.strokeColor,
          settings.strokeWidth,
          group,
        );
      }
    }

    if (settings.layers.structure) {
      const line = new paper.Path([...points[i], points[i][0]]);
      line.strokeColor = settings.strokeColor;
      line.strokeWidth = settings.strokeWidth;
      group.addChild(line);
    }

    // Upwards triangle
    if (settings.layers.masculinity) {
      const upwardsTriangle = new paper.Path([
        points[i][1],
        points[i][3],
        points[i][5],
        points[i][1],
      ]);
      upwardsTriangle.strokeColor = settings.strokeColor;
      upwardsTriangle.strokeWidth = settings.strokeWidth;
      group.addChild(upwardsTriangle);
    }

    if (settings.layers.femininity) {
      const downwardsTriangle = new paper.Path([
        points[i][0],
        points[i][2],
        points[i][4],
        points[i][0],
      ]);
      downwardsTriangle.strokeColor = settings.strokeColor;
      downwardsTriangle.strokeWidth = settings.strokeWidth;
      group.addChild(downwardsTriangle);
    }
  }

  if (settings.layers.interconnectedness) {
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
      group.addChild(line0);
      group.addChild(line1);
      group.addChild(line2);
    }
  }

  return group;
}
