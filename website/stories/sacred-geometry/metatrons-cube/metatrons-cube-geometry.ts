import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle } from "../utils";

export function metatronsCube(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  outlineVisible = false,
  creation = false,
  structure = false,
  masculinity = false,
  femininity = false,
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
  let innerRadius = radius / 5;

  const startAngle = -Math.PI / 6;

  if (creation) {
    createCircle(center, innerRadius, strokeColor, strokeWidth, group);
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

      if (creation) {
        createCircle(
          new paper.Point(x, y),
          innerRadius,
          strokeColor,
          strokeWidth,
          group,
        );
      }
    }

    if (structure) {
      const line = new paper.Path([...points[i], points[i][0]]);
      line.strokeColor = strokeColor;
      line.strokeWidth = strokeWidth;
      group.addChild(line);
    }

    // Upwards triangle
    if (masculinity) {
      const upwardsTriangle = new paper.Path([
        points[i][1],
        points[i][3],
        points[i][5],
        points[i][1],
      ]);
      upwardsTriangle.strokeColor = strokeColor;
      upwardsTriangle.strokeWidth = strokeWidth;
      group.addChild(upwardsTriangle);
    }

    if (femininity) {
      const downwardsTriangle = new paper.Path([
        points[i][0],
        points[i][2],
        points[i][4],
        points[i][0],
      ]);
      downwardsTriangle.strokeColor = strokeColor;
      downwardsTriangle.strokeWidth = strokeWidth;
      group.addChild(downwardsTriangle);
    }
  }

  if (interconnectedness) {
    // Draw lines between outer circles and inner circles
    for (let j = 0; j < 6; j++) {
      const p0 = (j + 2) % points[0].length;
      const p1 = (j + 3) % points[0].length;
      const p2 = (j + 4) % points[0].length;
      console.log(j, p0, p1, p2);

      const line0 = new paper.Path([points[1][j], points[0][p0]]);
      line0.strokeColor = strokeColor;
      line0.strokeWidth = strokeWidth;
      const line1 = new paper.Path([points[1][j], points[0][p1]]);
      line1.strokeColor = strokeColor;
      line1.strokeWidth = strokeWidth;
      const line2 = new paper.Path([points[1][j], points[0][p2]]);
      line2.strokeColor = strokeColor;
      line2.strokeWidth = strokeWidth;
      group.addChild(line0);
      group.addChild(line1);
      group.addChild(line2);
    }
  }

  // Draw lines between outer circles

  return group;
}
