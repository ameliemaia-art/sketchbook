import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, debugPoints, lerp } from "../utils";

function getIntersections(
  circle: paper.Path.Circle,
  points: paper.Point[][],
  result: paper.Point[],
) {
  const intersections: paper.CurveLocation[] = [];

  points.forEach((set) => {
    const line = new paper.Path.Line(set[0], set[1]);
    intersections.push(...circle.getIntersections(line));
    line.remove();
  });

  result.push(...intersections.map((intersection) => intersection.point));
}

function drawGuideLines(
  points: paper.Point[],
  strokeColor: paper.Color,
  strokeWidth: number,
  group: paper.Group,
) {
  createLine(
    [
      points[0],
      points[1],
      points[2],
      points[7],
      points[9],
      points[6],
      points[3],
      points[4],
      points[0],
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [points[1], points[5], points[4], points[1]],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [points[2], points[5], points[3], points[2]],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [points[7], points[8], points[6], points[5], points[7], points[6]],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine([points[0], points[9]], strokeColor, strokeWidth, group);
}

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

  // drawGuideLines(
  //   treeOfLifePoints,
  //   new paper.Color(1, 1, 1, 0.25),
  //   strokeWidth,
  //   group,
  // );

  // debugPoints(treeOfLifePoints, strokeColor);

  const r = (innerRadius / 3) * 0.75;

  const circleGroup = new paper.Group();
  const circles: paper.Path.Circle[] = [];

  treeOfLifePoints.forEach((point, i) => {
    circles.push(createCircle(point, r, strokeColor, 1, circleGroup));
  });

  const points: paper.Point[] = [];

  getIntersections(
    circles[0],
    [
      [treeOfLifePoints[0], treeOfLifePoints[1]],
      [treeOfLifePoints[0], treeOfLifePoints[9]],
      [treeOfLifePoints[0], treeOfLifePoints[4]],
    ],
    points,
  );
  getIntersections(
    circles[1],
    [
      [treeOfLifePoints[1], treeOfLifePoints[0]],
      [treeOfLifePoints[1], treeOfLifePoints[4]],
      [treeOfLifePoints[1], treeOfLifePoints[2]],
      [treeOfLifePoints[1], treeOfLifePoints[5]],
    ],
    points,
  );
  getIntersections(
    circles[4],
    [
      [treeOfLifePoints[4], treeOfLifePoints[0]],
      [treeOfLifePoints[4], treeOfLifePoints[1]],
      [treeOfLifePoints[4], treeOfLifePoints[3]],
      [treeOfLifePoints[4], treeOfLifePoints[5]],
    ],
    points,
  );
  getIntersections(
    circles[2],
    [
      [treeOfLifePoints[2], treeOfLifePoints[1]],
      [treeOfLifePoints[2], treeOfLifePoints[3]],
      [treeOfLifePoints[2], treeOfLifePoints[5]],
      [treeOfLifePoints[2], treeOfLifePoints[7]],
    ],
    points,
  );
  getIntersections(
    circles[3],
    [
      [treeOfLifePoints[3], treeOfLifePoints[4]],
      [treeOfLifePoints[3], treeOfLifePoints[2]],
      [treeOfLifePoints[3], treeOfLifePoints[5]],
      [treeOfLifePoints[3], treeOfLifePoints[6]],
    ],
    points,
  );
  getIntersections(
    circles[5],
    [
      [treeOfLifePoints[5], treeOfLifePoints[0]],
      [treeOfLifePoints[5], treeOfLifePoints[2]],
      [treeOfLifePoints[5], treeOfLifePoints[3]],
      [treeOfLifePoints[5], treeOfLifePoints[7]],
      [treeOfLifePoints[5], treeOfLifePoints[6]],
      [treeOfLifePoints[5], treeOfLifePoints[8]],
      [treeOfLifePoints[5], treeOfLifePoints[1]],
      [treeOfLifePoints[5], treeOfLifePoints[4]],
    ],
    points,
  );
  getIntersections(
    circles[7],
    [
      [treeOfLifePoints[7], treeOfLifePoints[2]],
      [treeOfLifePoints[7], treeOfLifePoints[5]],
      [treeOfLifePoints[7], treeOfLifePoints[6]],
      [treeOfLifePoints[7], treeOfLifePoints[8]],
      [treeOfLifePoints[7], treeOfLifePoints[9]],
    ],
    points,
  );
  getIntersections(
    circles[6],
    [
      [treeOfLifePoints[6], treeOfLifePoints[3]],
      [treeOfLifePoints[6], treeOfLifePoints[5]],
      [treeOfLifePoints[6], treeOfLifePoints[7]],
      [treeOfLifePoints[6], treeOfLifePoints[8]],
      [treeOfLifePoints[6], treeOfLifePoints[9]],
    ],
    points,
  );
  getIntersections(
    circles[8],
    [
      [treeOfLifePoints[8], treeOfLifePoints[7]],
      [treeOfLifePoints[8], treeOfLifePoints[5]],
      [treeOfLifePoints[8], treeOfLifePoints[6]],
      [treeOfLifePoints[8], treeOfLifePoints[9]],
    ],
    points,
  );
  getIntersections(
    circles[9],
    [
      [treeOfLifePoints[9], treeOfLifePoints[7]],
      [treeOfLifePoints[9], treeOfLifePoints[8]],
      [treeOfLifePoints[9], treeOfLifePoints[6]],
    ],
    points,
  );

  // const test = lerp(treeOfLifePoints[5], treeOfLifePoints[6], 0.5);
  // createCircle(test, r, new paper.Color(1, 0, 0, 1), 1, group);
  // debugPoints(points, strokeColor);

  // Circle 0
  createLine([points[0], points[3]], strokeColor, strokeWidth, group);
  createLine([points[1], points[19]], strokeColor, strokeWidth, group);
  createLine([points[2], points[7]], strokeColor, strokeWidth, group);

  // Circle 1
  createLine([points[4], points[8]], strokeColor, strokeWidth, group);
  createLine([points[6], points[25]], strokeColor, strokeWidth, group);
  createLine([points[5], points[11]], strokeColor, strokeWidth, group);

  // Circle 4
  createLine([points[9], points[15]], strokeColor, strokeWidth, group);
  createLine([points[10], points[26]], strokeColor, strokeWidth, group);

  // Circle 2
  createLine([points[12], points[16]], strokeColor, strokeWidth, group);
  createLine([points[13], points[20]], strokeColor, strokeWidth, group);
  createLine([points[14], points[27]], strokeColor, strokeWidth, group);

  // Circle 3
  createLine([points[18], points[32]], strokeColor, strokeWidth, group);
  createLine([points[17], points[21]], strokeColor, strokeWidth, group);

  // Circle 7
  createLine([points[28], points[22]], strokeColor, strokeWidth, group);
  createLine([points[29], points[34]], strokeColor, strokeWidth, group);
  createLine([points[30], points[37]], strokeColor, strokeWidth, group);
  createLine([points[31], points[41]], strokeColor, strokeWidth, group);

  // Circle 6
  createLine([points[33], points[23]], strokeColor, strokeWidth, group);
  createLine([points[35], points[39]], strokeColor, strokeWidth, group);
  createLine([points[36], points[43]], strokeColor, strokeWidth, group);

  // Circle 8
  createLine([points[38], points[24]], strokeColor, strokeWidth, group);
  createLine([points[40], points[42]], strokeColor, strokeWidth, group);

  return group;
}
