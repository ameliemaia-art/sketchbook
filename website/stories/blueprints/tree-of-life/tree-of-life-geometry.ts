import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createLine,
  debugPoints,
  lerp,
} from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type TreeOfLifeSettings = {
  blueprint: {
    guide0: boolean;
    guide1: boolean;
    guide2: boolean;
    guide3: boolean;
  };
  form: {
    architecture0: boolean;
    architecture1: boolean;
    architecture2: boolean;
    architecture3: boolean;
    architecture4: boolean;
    architecture5: boolean;
    architecture6: boolean;
    architecture7: boolean;
    architecture8: boolean;
    architecture9: boolean;
  };
};

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
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings & TreeOfLifeSettings,
) {
  const startAngle = -Math.PI / 6;
  const innerRadius = radius / 3;
  const dimensions = 3;
  const total = 6;
  const debugStrokeColor = new paper.Color(1, 1, 1, 0.25);
  const circlePoints = [];

  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

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

        if (settings.blueprint.guide0) {
          createCircle(
            p,
            innerRadius,
            debugStrokeColor,
            settings.strokeWidth,
            undefined,
            blueprint,
          );
        }

        circlePoints.push(p);
      }
    }
  }

  // debugPoints(circlePoints, new paper.Color(0, 1, 0, 1));

  // const lines = [];

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

  const circles: paper.Path.Circle[] = [];

  const transparentColor = new paper.Color(0, 0, 0, 0);

  treeOfLifePoints.forEach((point, i) => {
    circles.push(
      createCircle(
        point,
        r,
        settings.blueprint.guide1 ? debugStrokeColor : transparentColor,
        settings.strokeWidth,
        undefined,
        form,
      ),
    );
  });

  if (settings.blueprint.guide2) {
    drawGuideLines(
      treeOfLifePoints,
      debugStrokeColor,
      settings.strokeWidth,
      blueprint,
    );
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
    settings.strokeWidth,
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
    settings.strokeWidth,
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
    settings.strokeWidth,
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
    settings.strokeWidth,
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
    settings.strokeWidth,
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
    settings.strokeWidth,
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
    settings.strokeWidth,
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
    settings.strokeWidth,
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
    settings.strokeWidth,
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
    settings.strokeWidth,
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

  if (settings.blueprint.guide3) {
    blueprint.addChild(
      debugPoints(
        points,
        debugStrokeColor,
        settings.strokeWidth,
        smallCircleRadius,
      ),
    );
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

  if (settings.form.architecture0) {
    treeOfLifePoints.forEach((point, i) => {
      circles.push(
        createCircle(
          point,
          r,
          settings.form.architecture0 ? settings.strokeColor : transparentColor,
          settings.strokeWidth,
          undefined,
          form,
        ),
      );
    });
  }

  // Circle 0
  if (settings.form.architecture1) {
    createLine(
      [points[0], points[7]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[1], points[6]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[2], points[89]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[3], points[93]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[4], points[15]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[5], points[14]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[88], points[90]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[92], points[94]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[91], points[39]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[95], points[38]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  // Circle 1
  if (settings.form.architecture2) {
    createLine(
      [points[8], points[16]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[9], points[17]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[12], points[98]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[13], points[96]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[99], points[51]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[97], points[50]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[10], points[23]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[11], points[22]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  // Circle 4
  if (settings.form.architecture3) {
    createLine(
      [points[20], points[100]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[21], points[102]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[101], points[53]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[103], points[52]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[18], points[31]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[19], points[30]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  // Circle 2
  if (settings.form.architecture4) {
    createLine(
      [points[24], points[32]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[25], points[33]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[27], points[40]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[26], points[41]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[28], points[55]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[29], points[54]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  // Circle 3
  if (settings.form.architecture5) {
    createLine(
      [points[34], points[43]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[35], points[42]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[36], points[65]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[37], points[64]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  // Circle 7
  if (settings.form.architecture6) {
    createLine(
      [points[57], points[44]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[56], points[45]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[58], points[68]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[59], points[69]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[61], points[74]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[60], points[75]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[60], points[75]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[63], points[82]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[62], points[83]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  // Circle 6
  if (settings.form.architecture7) {
    createLine(
      [points[66], points[47]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[67], points[46]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[70], points[79]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[71], points[78]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[72], points[87]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[73], points[86]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  // Circle 8
  if (settings.form.architecture8) {
    createLine(
      [points[77], points[105]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[104], points[48]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[76], points[107]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[106], points[49]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }

  // Circle 9
  if (settings.form.architecture9) {
    createLine(
      [points[85], points[80]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
    createLine(
      [points[84], points[81]],
      settings.strokeColor,
      settings.strokeWidth,
      form,
    );
  }
}
