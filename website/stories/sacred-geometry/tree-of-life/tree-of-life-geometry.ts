import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, debugPoints, lerp } from "../utils";

export function treeOfLife(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  universe = false,
  creation = true,
) {
  const group = new paper.Group();

  if (universe) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = strokeColor;
    path.strokeWidth = strokeWidth;
    group.addChild(path);
  }

  const startAngle = -Math.PI / 6;
  const innerRadius = radius / 3;
  const dimensions = 3;
  const total = 6;

  const circlePoints = [];

  for (let i = 0; i < dimensions - 1; i++) {
    const points: paper.Point[] = [];
    const outlineRadius = innerRadius * (i + 1);
    for (let j = 0; j < total; j++) {
      const theta = startAngle + (TWO_PI / total) * j;
      const x = center.x + Math.cos(theta) * outlineRadius;
      const y = center.y + Math.sin(theta) * outlineRadius;
      points.push(new paper.Point(x, y));
    }

    const length = points.length;
    for (let k = 0; k < length; k++) {
      const p0 = points[k];
      const p1 = points[k === length - 1 ? 0 : k + 1];

      const circlesPerDimension = i + 2;
      for (let l = 0; l < circlesPerDimension; l++) {
        const t = l / (circlesPerDimension - 1);
        const p = lerp(p0, p1, t);
        createCircle(
          p,
          innerRadius,
          new paper.Color(1, 1, 1, 0),
          strokeWidth,
          group,
        );
        circlePoints.push(p);
      }
    }
  }

  // debugPoints(circlePoints, new paper.Color(0, 1, 0, 1));

  const lines = [];

  const treeOfLifePoints = [
    //
    circlePoints[26],
    circlePoints[28],
    circlePoints[0],
    circlePoints[7],
    circlePoints[25],
    center,
    circlePoints[6],
    circlePoints[2],
    circlePoints[3],
    circlePoints[17],
  ];

  lines.push(
    createLine(
      [
        //
        treeOfLifePoints[0],
        treeOfLifePoints[1],
        treeOfLifePoints[2],
        treeOfLifePoints[7],
        treeOfLifePoints[9],
        treeOfLifePoints[6],
        treeOfLifePoints[3],
        treeOfLifePoints[4],
        treeOfLifePoints[0],
      ],
      strokeColor,
      strokeWidth,
      group,
    ),
  );

  lines.push(
    createLine(
      [
        //
        treeOfLifePoints[1],
        treeOfLifePoints[5],
        treeOfLifePoints[4],
        treeOfLifePoints[1],
      ],
      strokeColor,
      strokeWidth,
      group,
    ),
  );
  lines.push(
    createLine(
      [
        //
        treeOfLifePoints[2],
        treeOfLifePoints[5],
        treeOfLifePoints[3],
        treeOfLifePoints[2],
      ],
      strokeColor,
      strokeWidth,
      group,
    ),
  );
  lines.push(
    createLine(
      [
        //
        treeOfLifePoints[7],
        treeOfLifePoints[8],
        treeOfLifePoints[6],
        treeOfLifePoints[5],
        treeOfLifePoints[7],
        treeOfLifePoints[6],
      ],
      strokeColor,
      strokeWidth,
      group,
    ),
  );
  lines.push(
    createLine(
      [
        //
        treeOfLifePoints[0],
        treeOfLifePoints[9],
      ],
      strokeColor,
      strokeWidth,
      group,
    ),
  );

  const r = (innerRadius / 3) * 0.75;

  const circleGroup = new paper.Group();

  treeOfLifePoints.forEach((point, i) => {
    createCircle(point, r, strokeColor, 1, circleGroup);
  });

  // const test = lerp(treeOfLifePoints[5], treeOfLifePoints[6], 0.5);
  // createCircle(test, r, new paper.Color(1, 0, 0, 1), 1, group);
  // debugPoints(treeOfLifePoints, strokeColor);

  return group;
}
