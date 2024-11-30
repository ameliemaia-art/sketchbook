import paper from "paper";
import { MathUtils } from "three";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, debugPoints, lerp } from "../utils";

function createCircleCornerPoints(
  center: paper.Point,
  radius: number,
  points: paper.Point[],
) {
  const length = 4;
  for (let i = 0; i < length; i++) {
    const theta = i * (TWO_PI / length);
    const x = center.x + Math.cos(theta) * radius;
    const y = center.y + Math.sin(theta) * radius;
    points.push(new paper.Point(x, y));
  }
}

function calculatePointOnCircle(
  angle: number,
  center: paper.Point,
  radius: number,
) {
  const x = center.x + Math.cos(angle) * radius;
  const y = center.y + Math.sin(angle) * radius;
  return new paper.Point(x, y);
}

export function sriYantra(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  outlineVisible = false,
) {
  const group = new paper.Group();

  if (outlineVisible) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = strokeColor;
    path.strokeWidth = strokeWidth;
    group.addChild(path);
  }

  // Line from center
  let innerRadius = radius / 2;

  const centerCircle = createCircle(
    center,
    innerRadius,
    strokeColor,
    strokeWidth,
    group,
  );

  let total = 4;
  const outerCircles = [];
  for (let i = 0; i < total; i++) {
    const theta = (TWO_PI / total) * i;
    const x = center.x + Math.cos(theta) * innerRadius;
    const y = center.y + Math.sin(theta) * innerRadius;
    outerCircles.push(
      createCircle(
        new paper.Point(x, y),
        innerRadius,
        strokeColor,
        strokeWidth,
        group,
      ),
    );
  }

  // Draw vertical line down
  const line0 = createLine(
    [
      new paper.Point(center.x, center.y - radius),
      new paper.Point(center.x, center.y + radius),
    ],
    strokeColor,
    strokeWidth,
    group,
  );
  // Creatwe horizontal line
  const line1 = createLine(
    [
      new paper.Point(center.x - radius, center.y),
      new paper.Point(center.x + radius, center.y),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Key points to reuse
  let points: paper.Point[] = [];

  let length = 4;
  // 4 corners of inner circle
  createCircleCornerPoints(center, innerRadius, points);

  const r = innerRadius * Math.SQRT2;
  let startAngle = Math.PI / length;
  for (let i = 0; i < length; i++) {
    const theta = startAngle + i * (TWO_PI / length);
    const x = center.x + Math.cos(theta) * r;
    const y = center.y + Math.sin(theta) * r;
    points.push(new paper.Point(x, y));
  }

  const debugLineColor = new paper.Color(1, 0, 0, 1);
  // createLine([points[5], points[0]], debugLineColor, strokeWidth, group);
  // createLine([points[4], points[2]], debugLineColor, strokeWidth, group);
  const line2 = createLine(
    [points[6], points[5]],
    debugLineColor,
    strokeWidth,
    group,
  );
  const line3 = createLine(
    [points[7], points[4]],
    debugLineColor,
    strokeWidth,
    group,
  );

  // 4 corners of inner circle
  const p0 = calculatePointOnCircle(
    MathUtils.degToRad(30),
    center,
    innerRadius,
  );
  const p1 = calculatePointOnCircle(
    MathUtils.degToRad(150),
    center,
    innerRadius,
  );
  const p2 = calculatePointOnCircle(
    MathUtils.degToRad(210),
    center,
    innerRadius,
  );
  const p3 = calculatePointOnCircle(
    MathUtils.degToRad(330),
    center,
    innerRadius,
  );
  points.push(p0, p1, p2, p3);
  // createCircle(p0, 10, strokeColor, strokeWidth, group);
  // createCircle(p1, 10, strokeColor, strokeWidth, group);
  // createCircle(p2, 10, strokeColor, strokeWidth, group);
  // createCircle(p3, 10, strokeColor, strokeWidth, group);

  const line4 = createLine(
    [points[9], points[0]],
    debugLineColor,
    strokeWidth,
    group,
  );
  const line5 = createLine(
    [points[8], points[2]],
    debugLineColor,
    strokeWidth,
    group,
  );
  const intersection = line4.getIntersections(line5)[0].point;
  const innerSideRadius = intersection.getDistance(center);
  points.push(intersection);
  const innerRightCircle = createCircle(
    points[0],
    innerSideRadius,
    new paper.Color(0, 1, 0, 1),
    strokeWidth,
    group,
  );
  const innerLeftCircle = createCircle(
    points[2],
    innerSideRadius,
    new paper.Color(0, 1, 0, 1),
    strokeWidth,
    group,
  );

  createCircleCornerPoints(points[0], innerSideRadius, points);
  createCircleCornerPoints(points[2], innerSideRadius, points);

  // createCircle(midPoint2To4, 10, strokeColor, strokeWidth, group);

  const line6 = createLine(
    [points[18], points[14]],
    debugLineColor,
    strokeWidth,
    group,
  );

  const intersection2 =
    innerRightCircle.getIntersections(centerCircle)[1].point;

  const intersection3 = innerLeftCircle.getIntersections(centerCircle)[1].point;

  points.push(intersection2, intersection3);

  createLine([points[22], points[3]], debugLineColor, strokeWidth, group);
  createLine([points[21], points[3]], debugLineColor, strokeWidth, group);

  const intersection5 = centerCircle.getIntersections(outerCircles[2])[0].point;
  const intersection6 = centerCircle.getIntersections(outerCircles[0])[0].point;

  points.push(intersection5, intersection6);

  const xyz = createLine(
    [points[9], points[23]],
    debugLineColor,
    strokeWidth,
    group,
  );
  createLine([points[8], points[24]], debugLineColor, strokeWidth, group);

  let direction = points[17].subtract(points[1]).normalize();
  let dist = points[17].getDistance(points[1]);

  let line7 = createLine(
    [
      points[1],
      points[17].add(new paper.Point(direction.x, direction.y).multiply(dist)),
    ],
    debugLineColor,
    strokeWidth,
    group,
  );
  const intersection7 = line2.getIntersections(line7)[0].point;
  line7.remove();

  points.push(intersection7);
  dist = points[1].getDistance(points[15]);
  direction = points[15].subtract(points[1]).normalize();

  let line8 = createLine(
    [
      points[1],
      points[15].add(new paper.Point(direction.x, direction.y).multiply(dist)),
    ],
    debugLineColor,
    strokeWidth,
    group,
  );
  const intersection8 = line3.getIntersections(line8)[0].point;
  line8.remove();

  points.push(intersection8);

  line7 = createLine(
    [points[1], points[25]],
    debugLineColor,
    strokeWidth,
    group,
  );

  line8 = createLine(
    [points[1], points[26]],
    debugLineColor,
    strokeWidth,
    group,
  );

  const line9 = createLine(
    [points[25], points[26]],
    debugLineColor,
    strokeWidth,
    group,
  );

  const line10 = createLine(
    [points[10], points[3]],
    debugLineColor,
    strokeWidth,
    group,
  );
  const line11 = createLine(
    [points[3], points[11]],
    debugLineColor,
    strokeWidth,
    group,
  );
  const line12 = createLine(
    [points[23], points[8]],
    debugLineColor,
    strokeWidth,
    group,
  );
  const line13 = createLine(
    [points[24], points[9]],
    debugLineColor,
    strokeWidth,
    group,
  );

  // inteesect
  const intersection9 = line12.getIntersections(line10)[0].point;
  points.push(intersection9);

  const intersection10 = line13.getIntersections(line11)[0].point;
  points.push(intersection10);

  let line14 = createLine(
    [points[27], points[28]],
    debugLineColor,
    strokeWidth,
    group,
  );
  direction = points[27].subtract(points[28]).normalize();
  line14.remove();
  line14 = createLine(
    [
      new paper.Point(center.x - direction.x * innerRadius, points[27].y),
      new paper.Point(center.x + direction.x * innerRadius, points[27].y),
    ],
    debugLineColor,
    strokeWidth,
    group,
  );

  const intersection11 = line14.getIntersections(centerCircle);
  points.push(intersection11[0].point, intersection11[1].point);
  line14.remove();
  // createCircle(intersection2, 10, strokeColor, strokeWidth, group);
  // createCircle(intersection3, 10, strokeColor, strokeWidth, group);

  line14 = createLine(
    [points[30], points[29]],
    debugLineColor,
    strokeWidth,
    group,
  );

  const line15 = createLine(
    [points[3], points[1]],
    debugLineColor,
    strokeWidth,
    group,
  );

  const intersection12 = line15.getIntersections(line14);
  points.push(intersection12[0].point);

  const intersection13 = line8.getIntersections(line6);
  points.push(intersection13[0].point);

  const intersection14 = line7.getIntersections(line6);
  points.push(intersection14[0].point);

  direction = points[32].subtract(points[31]).normalize();
  dist = points[32].getDistance(points[31]);
  let line16 = createLine(
    [
      points[31],
      points[32].add(new paper.Point(direction.x, direction.y).multiply(dist)),
    ],
    debugLineColor,
    strokeWidth,
    group,
  );
  const intersection15 = line16.getIntersections(centerCircle);
  points.push(intersection15[0].point);
  line16.remove();
  line16 = createLine(
    [points[31], points[34]],
    debugLineColor,
    strokeWidth,
    group,
  );

  direction = points[33].subtract(points[31]).normalize();
  dist = points[33].getDistance(points[31]);
  let line17 = createLine(
    [
      points[31],
      points[33].add(new paper.Point(direction.x, direction.y).multiply(dist)),
    ],
    debugLineColor,
    strokeWidth,
    group,
  );
  const intersection16 = line17.getIntersections(centerCircle);
  points.push(intersection16[0].point);
  line17.remove();
  line17 = createLine(
    [points[31], points[35]],
    debugLineColor,
    strokeWidth,
    group,
  );

  const line18 = createLine(
    [points[0], points[1]],
    debugLineColor,
    strokeWidth,
    group,
  );
  const line19 = createLine(
    [points[2], points[1]],
    debugLineColor,
    strokeWidth,
    group,
  );

  const intersection17 = centerCircle.getIntersections(outerCircles[2]);
  const intersection18 = centerCircle.getIntersections(outerCircles[0]);

  points.push(intersection17[1].point);
  points.push(intersection18[1].point);

  const line20 = createLine(
    [points[36], points[0]],
    debugLineColor,
    strokeWidth,
    group,
  );
  const line21 = createLine(
    [points[37], points[2]],
    debugLineColor,
    strokeWidth,
    group,
  );

  const intersection19 = line21.getIntersections(line18);
  points.push(intersection19[0].point);

  const intersection20 = line20.getIntersections(line19);
  points.push(intersection20[0].point);
  direction = points[38].subtract(points[1]).normalize();
  let line22 = createLine(
    [
      new paper.Point(center.x - direction.x * innerRadius, points[38].y),
      new paper.Point(center.x + direction.x * innerRadius, points[39].y),
    ],
    debugLineColor,
    strokeWidth,
    group,
  );
  const intersection21 = line22.getIntersections(centerCircle);
  points.push(intersection21[0].point, intersection21[1].point);
  line22.remove();
  line22 = createLine(
    [points[40], points[41]],
    debugLineColor,
    strokeWidth,
    group,
  );

  const intersection22 = line9.getIntersections(centerCircle);

  debugPoints(points, strokeColor);

  return group;
}
