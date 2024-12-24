import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createLine,
  debugPoints,
  lerp,
} from "../../../utils/paper/utils";

function getCircleIntersections(
  circle: paper.Path.Circle,
  points: paper.Point[][],
  result: paper.Point[],
  smallCircleRadius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
) {
  const intersections: paper.CurveLocation[] = [];
  const circleIntersections: paper.CurveLocation[] = [];

  points.forEach((set) => {
    const line = new paper.Path.Line(set[0], set[1]);
    line.strokeColor = strokeColor;
    line.strokeWidth = strokeWidth;
    intersections.push(...circle.getIntersections(line));
    line.remove();
  });

  // Spawn circle on intersection points
  intersections.forEach((intersection) => {
    const circle2 = createCircle(
      intersection.point,
      smallCircleRadius,
      strokeColor,
      strokeWidth,
    );
    circleIntersections.push(...circle.getIntersections(circle2));
    circle2.remove();
  });

  result.push(...circleIntersections.map((intersection) => intersection.point));
}

function getLineIntersections(
  lines1: paper.Point[][],
  lines2: paper.Point[][],
  result: paper.Point[],
  strokeColor: paper.Color,
) {
  const intersections: paper.CurveLocation[] = [];

  lines1.forEach((set1) => {
    const line1 = new paper.Path.Line(set1[0], set1[1]);
    line1.strokeColor = strokeColor;
    lines2.forEach((set2) => {
      const line2 = new paper.Path.Line(set2[0], set2[1]);
      line2.strokeColor = strokeColor;
      intersections.push(...line1.getIntersections(line2));
      line2.remove();
    });
    line1.remove();
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
  debugStrokeColor: paper.Color,
  strokeWidth: number,
  universe = false,
  guide0 = true,
  guide1 = true,
  guide2 = true,
  guide3 = true,
  form0 = true,
  form1 = true,
  form2 = true,
  form3 = true,
  form4 = true,
  form5 = true,
  form6 = true,
  form7 = true,
  form8 = true,
  form9 = true,
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

        if (guide0) {
          createCircle(p, innerRadius, debugStrokeColor, strokeWidth, group);
        }

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

  const r = (innerRadius / 3) * 0.75;

  // if (guide2) {
  //   // debugPoints(treeOfLifePoints, new paper.Color(1, 1, 1, 0.75), r);
  // }

  const circleGroup = new paper.Group();
  const circles: paper.Path.Circle[] = [];

  const transparentColor = new paper.Color(0, 0, 0, 0);

  treeOfLifePoints.forEach((point, i) => {
    circles.push(
      createCircle(
        point,
        r,
        guide1 ? debugStrokeColor : transparentColor,
        strokeWidth,
        circleGroup,
      ),
    );
  });

  if (guide2) {
    drawGuideLines(treeOfLifePoints, debugStrokeColor, strokeWidth, group);
  }

  const points: paper.Point[] = [];

  const smallCircleRadius = r / 4;

  getCircleIntersections(
    circles[0],
    [
      [treeOfLifePoints[0], treeOfLifePoints[1]],
      [treeOfLifePoints[0], treeOfLifePoints[9]],
      [treeOfLifePoints[0], treeOfLifePoints[4]],
    ],
    points,
    smallCircleRadius,
    debugStrokeColor,
    strokeWidth,
  );
  getCircleIntersections(
    circles[1],
    [
      [treeOfLifePoints[1], treeOfLifePoints[0]],
      [treeOfLifePoints[1], treeOfLifePoints[4]],
      [treeOfLifePoints[1], treeOfLifePoints[2]],
      [treeOfLifePoints[1], treeOfLifePoints[5]],
    ],
    points,
    smallCircleRadius,
    debugStrokeColor,
    strokeWidth,
  );
  getCircleIntersections(
    circles[4],
    [
      [treeOfLifePoints[4], treeOfLifePoints[0]],
      [treeOfLifePoints[4], treeOfLifePoints[1]],
      [treeOfLifePoints[4], treeOfLifePoints[3]],
      [treeOfLifePoints[4], treeOfLifePoints[5]],
    ],
    points,
    smallCircleRadius,
    debugStrokeColor,
    strokeWidth,
  );
  getCircleIntersections(
    circles[2],
    [
      [treeOfLifePoints[2], treeOfLifePoints[1]],
      [treeOfLifePoints[2], treeOfLifePoints[3]],
      [treeOfLifePoints[2], treeOfLifePoints[5]],
      [treeOfLifePoints[2], treeOfLifePoints[7]],
    ],
    points,
    smallCircleRadius,
    debugStrokeColor,
    strokeWidth,
  );
  getCircleIntersections(
    circles[3],
    [
      [treeOfLifePoints[3], treeOfLifePoints[4]],
      [treeOfLifePoints[3], treeOfLifePoints[2]],
      [treeOfLifePoints[3], treeOfLifePoints[5]],
      [treeOfLifePoints[3], treeOfLifePoints[6]],
    ],
    points,
    smallCircleRadius,
    debugStrokeColor,
    strokeWidth,
  );
  getCircleIntersections(
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
    smallCircleRadius,
    debugStrokeColor,
    strokeWidth,
  );
  getCircleIntersections(
    circles[7],
    [
      [treeOfLifePoints[7], treeOfLifePoints[2]],
      [treeOfLifePoints[7], treeOfLifePoints[5]],
      [treeOfLifePoints[7], treeOfLifePoints[6]],
      [treeOfLifePoints[7], treeOfLifePoints[8]],
      [treeOfLifePoints[7], treeOfLifePoints[9]],
    ],
    points,
    smallCircleRadius,
    debugStrokeColor,
    strokeWidth,
  );
  getCircleIntersections(
    circles[6],
    [
      [treeOfLifePoints[6], treeOfLifePoints[3]],
      [treeOfLifePoints[6], treeOfLifePoints[5]],
      [treeOfLifePoints[6], treeOfLifePoints[7]],
      [treeOfLifePoints[6], treeOfLifePoints[8]],
      [treeOfLifePoints[6], treeOfLifePoints[9]],
    ],
    points,
    smallCircleRadius,
    debugStrokeColor,
    strokeWidth,
  );
  getCircleIntersections(
    circles[8],
    [
      [treeOfLifePoints[8], treeOfLifePoints[7]],
      [treeOfLifePoints[8], treeOfLifePoints[5]],
      [treeOfLifePoints[8], treeOfLifePoints[6]],
      [treeOfLifePoints[8], treeOfLifePoints[9]],
    ],
    points,
    smallCircleRadius,
    debugStrokeColor,
    strokeWidth,
  );
  getCircleIntersections(
    circles[9],
    [
      [treeOfLifePoints[9], treeOfLifePoints[7]],
      [treeOfLifePoints[9], treeOfLifePoints[8]],
      [treeOfLifePoints[9], treeOfLifePoints[6]],
    ],
    points,
    smallCircleRadius,
    debugStrokeColor,
    strokeWidth,
  );

  getLineIntersections(
    [
      [points[2], points[39]],
      [points[3], points[38]],
    ],
    [
      [points[9], points[17]],
      [points[8], points[16]],
      [points[24], points[32]],
      [points[25], points[33]],
    ],
    points,
    debugStrokeColor,
  );
  getLineIntersections(
    [
      [points[13], points[50]],
      [points[12], points[51]],
    ],
    [
      [points[24], points[32]],
      [points[25], points[33]],
    ],
    points,
    debugStrokeColor,
  );
  getLineIntersections(
    [
      [points[20], points[53]],
      [points[21], points[52]],
    ],
    [
      [points[24], points[32]],
      [points[25], points[33]],
    ],
    points,
    debugStrokeColor,
  );
  getLineIntersections(
    [
      [points[48], points[77]],
      [points[49], points[76]],
    ],
    [
      [points[58], points[68]],
      [points[59], points[69]],
    ],
    points,
    debugStrokeColor,
  );

  // const test = lerp(treeOfLifePoints[5], treeOfLifePoints[6], 0.5);
  // createCircle(test, r, new paper.Color(1, 0, 0, 1), 1, group);

  if (guide3) {
    debugPoints(points, debugStrokeColor, strokeWidth, smallCircleRadius);
  }

  // for (let i = 0; i < 4; i++) {
  //   const min = circles[0].position.clone();
  //   min.y -= r - smallCircleRadius;
  //   const max = circles[0].position.clone();
  //   max.y += r - smallCircleRadius;
  //   const pos = lerp(min, max, i / 3);
  //   createCircle(pos, smallCircleRadius, strokeColor, 1, group);
  // }

  // createCircle(points[2], smallCircleRadius, strokeColor, 1, group);
  // createCircle(points[0], smallCircleRadius, strokeColor, 1, group);
  //

  // points.forEach((point) => {
  //   createCircle(point, smallCircleRadius, strokeColor, 1, group);
  // });

  if (form0) {
    treeOfLifePoints.forEach((point, i) => {
      circles.push(
        createCircle(
          point,
          r,
          form0 ? strokeColor : transparentColor,
          strokeWidth,
          circleGroup,
        ),
      );
    });
  }

  // Circle 0
  if (form1) {
    createLine([points[0], points[7]], strokeColor, strokeWidth, group);
    createLine([points[1], points[6]], strokeColor, strokeWidth, group);
    createLine([points[2], points[89]], strokeColor, strokeWidth, group);
    createLine([points[3], points[93]], strokeColor, strokeWidth, group);
    createLine([points[4], points[15]], strokeColor, strokeWidth, group);
    createLine([points[5], points[14]], strokeColor, strokeWidth, group);
    createLine([points[88], points[90]], strokeColor, strokeWidth, group);
    createLine([points[92], points[94]], strokeColor, strokeWidth, group);
    createLine([points[91], points[39]], strokeColor, strokeWidth, group);
    createLine([points[95], points[38]], strokeColor, strokeWidth, group);
  }

  // Circle 1
  if (form2) {
    createLine([points[8], points[16]], strokeColor, strokeWidth, group);
    createLine([points[9], points[17]], strokeColor, strokeWidth, group);
    createLine([points[12], points[98]], strokeColor, strokeWidth, group);
    createLine([points[13], points[96]], strokeColor, strokeWidth, group);
    createLine([points[99], points[51]], strokeColor, strokeWidth, group);
    createLine([points[97], points[50]], strokeColor, strokeWidth, group);
    createLine([points[10], points[23]], strokeColor, strokeWidth, group);
    createLine([points[11], points[22]], strokeColor, strokeWidth, group);
  }

  // Circle 4
  if (form3) {
    createLine([points[20], points[100]], strokeColor, strokeWidth, group);
    createLine([points[21], points[102]], strokeColor, strokeWidth, group);
    createLine([points[101], points[53]], strokeColor, strokeWidth, group);
    createLine([points[103], points[52]], strokeColor, strokeWidth, group);
    createLine([points[18], points[31]], strokeColor, strokeWidth, group);
    createLine([points[19], points[30]], strokeColor, strokeWidth, group);
  }

  // Circle 2
  if (form4) {
    createLine([points[24], points[32]], strokeColor, strokeWidth, group);
    createLine([points[25], points[33]], strokeColor, strokeWidth, group);
    createLine([points[27], points[40]], strokeColor, strokeWidth, group);
    createLine([points[26], points[41]], strokeColor, strokeWidth, group);
    createLine([points[28], points[55]], strokeColor, strokeWidth, group);
    createLine([points[29], points[54]], strokeColor, strokeWidth, group);
  }

  // Circle 3
  if (form5) {
    createLine([points[34], points[43]], strokeColor, strokeWidth, group);
    createLine([points[35], points[42]], strokeColor, strokeWidth, group);
    createLine([points[36], points[65]], strokeColor, strokeWidth, group);
    createLine([points[37], points[64]], strokeColor, strokeWidth, group);
  }

  // Circle 7
  if (form6) {
    createLine([points[57], points[44]], strokeColor, strokeWidth, group);
    createLine([points[56], points[45]], strokeColor, strokeWidth, group);
    createLine([points[58], points[68]], strokeColor, strokeWidth, group);
    createLine([points[59], points[69]], strokeColor, strokeWidth, group);
    createLine([points[61], points[74]], strokeColor, strokeWidth, group);
    createLine([points[60], points[75]], strokeColor, strokeWidth, group);
    createLine([points[60], points[75]], strokeColor, strokeWidth, group);
    createLine([points[63], points[82]], strokeColor, strokeWidth, group);
    createLine([points[62], points[83]], strokeColor, strokeWidth, group);
  }

  // Circle 6
  if (form7) {
    createLine([points[66], points[47]], strokeColor, strokeWidth, group);
    createLine([points[67], points[46]], strokeColor, strokeWidth, group);
    createLine([points[70], points[79]], strokeColor, strokeWidth, group);
    createLine([points[71], points[78]], strokeColor, strokeWidth, group);
    createLine([points[72], points[87]], strokeColor, strokeWidth, group);
    createLine([points[73], points[86]], strokeColor, strokeWidth, group);
  }

  // Circle 8
  if (form8) {
    createLine([points[77], points[105]], strokeColor, strokeWidth, group);
    createLine([points[104], points[48]], strokeColor, strokeWidth, group);
    createLine([points[76], points[107]], strokeColor, strokeWidth, group);
    createLine([points[106], points[49]], strokeColor, strokeWidth, group);
  }

  // Circle 9
  if (form9) {
    createLine([points[85], points[80]], strokeColor, strokeWidth, group);
    createLine([points[84], points[81]], strokeColor, strokeWidth, group);
  }

  return group;
}
