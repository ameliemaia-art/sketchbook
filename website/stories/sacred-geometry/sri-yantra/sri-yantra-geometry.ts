import paper from "paper";
import { MathUtils } from "three";

import { createCircle, createLine } from "@utils/paper/utils";
import { TWO_PI } from "@utils/three/math";
import { SketchSettings } from "../sketch/sketch";

export type SriYantraSettings = {
  blueprint: {
    guide0: boolean;
    guide1: boolean;
    guide2: boolean;
    guide3: boolean;
    guide4: boolean;
    guide5: boolean;
    guide6: boolean;
    guide7: boolean;
    guide8: boolean;
    guide9: boolean;
    guide10: boolean;
    guide11: boolean;
    guide12: boolean;
    guide13: boolean;
    guide14: boolean;
    guide15: boolean;
    guide16: boolean;
    guide17: boolean;
    guide18: boolean;
    guide19: boolean;
    guide20: boolean;
    guide21: boolean;
    guide22: boolean;
    guide23: boolean;
    guide24: boolean;
    guide25: boolean;
    guide26: boolean;
    guide27: boolean;
    guide28: boolean;
  };
  form: {
    step0: boolean;
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
    step5: boolean;
    step6: boolean;
    step7: boolean;
    step8: boolean;
    step9: boolean;
  };
};

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
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings,
) {
  if (settings.blueprint.cosmos) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    blueprint.addChild(path);
  }

  // Line from center
  let innerRadius = radius / 2;

  const transparentColor = new paper.Color(0, 0, 0, 0);
  const debugStrokeColor = new paper.Color(1, 1, 1, 1);

  const centerCircle = createCircle(
    center,
    innerRadius,
    settings.blueprint.guide0 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
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
        settings.blueprint.guide1 ? debugStrokeColor : transparentColor,
        settings.strokeWidth,
        blueprint,
      ),
    );
  }

  // Draw vertical line down
  const line0 = createLine(
    [
      new paper.Point(center.x, center.y - radius),
      new paper.Point(center.x, center.y + radius),
    ],
    settings.blueprint.guide2 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  // Creatwe horizontal line
  const line1 = createLine(
    [
      new paper.Point(center.x - radius, center.y),
      new paper.Point(center.x + radius, center.y),
    ],
    settings.blueprint.guide2 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  // Key points to reuse
  let points: paper.Point[] = [];

  let length = 4;
  // 4 corners of inner circle
  createCircleCornerPoints(center, innerRadius, points);

  const r = innerRadius * Math.SQRT2;
  const startAngle = Math.PI / length;
  for (let i = 0; i < length; i++) {
    const theta = startAngle + i * (TWO_PI / length);
    const x = center.x + Math.cos(theta) * r;
    const y = center.y + Math.sin(theta) * r;
    points.push(new paper.Point(x, y));
  }

  // const debugStrokeColor = new paper.Color(1, 0, 0, 1);
  // createLine([points[5], points[0]], debugStrokeColor, strokeWidth, group);
  // createLine([points[4], points[2]], debugStrokeColor, strokeWidth, group);
  const line2 = createLine(
    [points[6], points[5]],
    settings.blueprint.guide3 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const line3 = createLine(
    [points[7], points[4]],
    settings.blueprint.guide3 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
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
  // createCircle(p0, 10, debugStrokeColor, strokeWidth, blueprint);
  // createCircle(p1, 10, debugStrokeColor, strokeWidth, blueprint);
  // createCircle(p2, 10, debugStrokeColor, strokeWidth, blueprint);
  // createCircle(p3, 10, debugStrokeColor, strokeWidth, blueprint);

  const line4 = createLine(
    [points[9], points[0]],
    settings.blueprint.guide4 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const line5 = createLine(
    [points[8], points[2]],
    settings.blueprint.guide4 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection = line4.getIntersections(line5)[0].point;
  const innerSideRadius = intersection.getDistance(center);
  points.push(intersection);
  const innerRightCircle = createCircle(
    points[0],
    innerSideRadius,
    settings.blueprint.guide5 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const innerLeftCircle = createCircle(
    points[2],
    innerSideRadius,
    settings.blueprint.guide5 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  createCircleCornerPoints(points[0], innerSideRadius, points);
  createCircleCornerPoints(points[2], innerSideRadius, points);

  // createCircle(midPoint2To4, 10, debugStrokeColor, strokeWidth, blueprint);

  const line6 = createLine(
    [points[18], points[14]],
    settings.blueprint.guide6 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection2 =
    innerRightCircle.getIntersections(centerCircle)[1].point;

  const intersection3 = innerLeftCircle.getIntersections(centerCircle)[1].point;

  points.push(intersection2, intersection3);

  const intersection5 = centerCircle.getIntersections(outerCircles[2])[0].point;
  const intersection6 = centerCircle.getIntersections(outerCircles[0])[0].point;

  points.push(intersection5, intersection6);

  let direction = points[17].subtract(points[1]).normalize();
  let dist = points[17].getDistance(points[1]);

  let line7 = createLine(
    [
      points[1],
      points[17].add(new paper.Point(direction.x, direction.y).multiply(dist)),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection7 = centerCircle.getIntersections(line7)[0].point;
  line7.remove();

  points.push(intersection7);
  dist = points[1].getDistance(points[15]);
  direction = points[15].subtract(points[1]).normalize();

  let line8 = createLine(
    [
      points[1],
      points[15].add(new paper.Point(direction.x, direction.y).multiply(dist)),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection8 = centerCircle.getIntersections(line8)[0].point;
  line8.remove();

  points.push(intersection8);

  line7 = createLine(
    [points[1], points[25]],
    settings.blueprint.guide7 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  line8 = createLine(
    [points[1], points[26]],
    settings.blueprint.guide7 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const line9 = createLine(
    [points[25], points[26]],
    settings.blueprint.guide8 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const line10 = createLine(
    [points[10], points[3]],
    settings.blueprint.guide9 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const line11 = createLine(
    [points[3], points[11]],
    settings.blueprint.guide9 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const line12 = createLine(
    [points[23], points[8]],
    settings.blueprint.guide10 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const line13 = createLine(
    [points[24], points[9]],
    settings.blueprint.guide10 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  // inteesect
  const intersection9 = line12.getIntersections(line10)[0].point;
  points.push(intersection9);

  const intersection10 = line13.getIntersections(line11)[0].point;
  points.push(intersection10);

  let line14 = createLine(
    [points[27], points[28]],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  direction = points[27].subtract(points[28]).normalize();
  line14.remove();
  line14 = createLine(
    [
      new paper.Point(center.x - direction.x * innerRadius, points[27].y),
      new paper.Point(center.x + direction.x * innerRadius, points[27].y),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection11 = line14.getIntersections(centerCircle);
  points.push(intersection11[0].point, intersection11[1].point);
  line14.remove();
  // createCircle(intersection2, 10, debugStrokeColor, strokeWidth, blueprint);
  // createCircle(intersection3, 10, debugStrokeColor, strokeWidth, blueprint);

  line14 = createLine(
    [points[30], points[29]],
    settings.blueprint.guide11 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const line15 = createLine(
    [points[3], points[1]],
    settings.blueprint.guide11 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
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
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection15 = line16.getIntersections(centerCircle);
  points.push(intersection15[0].point);
  line16.remove();
  line16 = createLine(
    [points[31], points[34]],
    settings.blueprint.guide12 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  direction = points[33].subtract(points[31]).normalize();
  dist = points[33].getDistance(points[31]);
  let line17 = createLine(
    [
      points[31],
      points[33].add(new paper.Point(direction.x, direction.y).multiply(dist)),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection16 = line17.getIntersections(centerCircle);
  points.push(intersection16[0].point);
  line17.remove();
  line17 = createLine(
    [points[31], points[35]],
    settings.blueprint.guide12 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const line18 = createLine(
    [points[0], points[1]],
    settings.blueprint.guide13 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const line19 = createLine(
    [points[2], points[1]],
    settings.blueprint.guide13 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection17 = centerCircle.getIntersections(outerCircles[2]);
  const intersection18 = centerCircle.getIntersections(outerCircles[0]);

  points.push(intersection17[1].point);
  points.push(intersection18[1].point);

  const line20 = createLine(
    [points[36], points[0]],
    settings.blueprint.guide14 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const line21 = createLine(
    [points[37], points[2]],
    settings.blueprint.guide14 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
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
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection21 = line22.getIntersections(centerCircle);
  points.push(intersection21[0].point, intersection21[1].point);
  line22.remove();
  line22 = createLine(
    [points[40], points[41]],
    settings.blueprint.guide15 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const line23 = createLine(
    [points[22], points[3]],
    settings.blueprint.guide16 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const line24 = createLine(
    [points[21], points[3]],
    settings.blueprint.guide16 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection22 = line9.getIntersections(line24);
  points.push(intersection22[0].point);

  const intersection23 = line9.getIntersections(line23);
  points.push(intersection23[0].point);

  const intersection24 = line15.getIntersections(line22);
  points.push(intersection24[0].point);

  direction = points[42].subtract(points[44]).normalize();
  let line25 = createLine(
    [
      points[44],
      points[42].add(
        new paper.Point(direction.x, direction.y).multiply(innerRadius),
      ),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection25 = line25.getIntersections(centerCircle);
  points.push(intersection25[0].point);
  line25.remove();
  line25 = createLine(
    [points[44], points[45]],
    settings.blueprint.guide17 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  direction = points[43].subtract(points[44]).normalize();
  let line26 = createLine(
    [
      points[44],
      points[43].add(
        new paper.Point(direction.x, direction.y).multiply(innerRadius),
      ),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection26 = line26.getIntersections(centerCircle);
  points.push(intersection26[0].point);
  line26.remove();
  line26 = createLine(
    [points[44], points[46]],
    settings.blueprint.guide17 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  // line15, line9
  const intersection27 = line15.getIntersections(line9);
  points.push(intersection27[0].point);

  const line27 = createLine(
    [points[47], points[37]],
    settings.blueprint.guide18 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const line28 = createLine(
    [points[47], points[36]],
    settings.blueprint.guide18 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection28 = line8.getIntersections(line27);
  points.push(intersection28[0].point);

  const intersection29 = line7.getIntersections(line28);
  points.push(intersection29[0].point);

  direction = points[49].subtract(points[48]).normalize();
  let line29 = createLine(
    [
      new paper.Point(center.x - direction.x * innerRadius, points[49].y),
      new paper.Point(center.x + direction.x * innerRadius, points[48].y),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection30 = line29.getIntersections(centerCircle);
  points.push(intersection30[0].point, intersection30[1].point);
  line29.remove();
  line29 = createLine(
    [points[50], points[51]],
    settings.blueprint.guide19 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  // 4 corners of inner circle
  const cornerCircle0 = createCircle(
    points[24],
    innerRadius,
    settings.blueprint.guide0 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const cornerCircle1 = createCircle(
    points[23],
    innerRadius,
    settings.blueprint.guide0 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const cornerCircle2 = createCircle(
    points[37],
    innerRadius,
    settings.blueprint.guide0 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const cornerCircle3 = createCircle(
    points[36],
    innerRadius,
    settings.blueprint.guide0 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection31 = cornerCircle0.getIntersections(line25);
  points.push(intersection31[0].point);

  const intersection32 = cornerCircle1.getIntersections(line26);
  points.push(intersection32[0].point);

  direction = points[52].subtract(points[53]).normalize();
  let line30 = createLine(
    [
      new paper.Point(center.x - direction.x * innerRadius, points[52].y),
      new paper.Point(center.x + direction.x * innerRadius, points[53].y),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection33 = line30.getIntersections(centerCircle);
  points.push(intersection33[0].point, intersection33[1].point);
  line30.remove();
  line30 = createLine(
    [points[54], points[55]],
    settings.blueprint.guide20 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection34 = line30.getIntersections(line15);
  points.push(intersection34[0].point);

  const intersection35 = line16.getIntersections(line9);
  points.push(intersection35[0].point);

  const intersection36 = line17.getIntersections(line9);
  points.push(intersection36[0].point);

  dist = points[56].getDistance(points[57]);
  direction = points[57].subtract(points[56]).normalize();

  let line31 = createLine(
    [
      points[56],
      points[57].add(
        new paper.Point(direction.x, direction.y).multiply(innerRadius),
      ),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection37 = line31.getIntersections(centerCircle);
  points.push(intersection37[0].point);
  line31.remove();
  line31 = createLine(
    [points[56], points[59]],
    settings.blueprint.guide21 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  dist = points[58].getDistance(points[56]);
  direction = points[58].subtract(points[56]).normalize();

  let line33 = createLine(
    [
      points[56],
      points[58].add(
        new paper.Point(direction.x, direction.y).multiply(innerRadius),
      ),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection38 = line33.getIntersections(centerCircle);
  points.push(intersection38[0].point);
  line33.remove();
  line33 = createLine(
    [points[56], points[60]],
    settings.blueprint.guide21 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const line34 = createLine(
    [points[10], points[11]],
    settings.blueprint.guide22 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection39 = line15.getIntersections(line34);
  points.push(intersection39[0].point);

  dist = points[61].getDistance(points[52]);
  direction = points[52].subtract(points[61]).normalize();
  let line35 = createLine(
    [
      points[61],
      points[52].add(
        new paper.Point(direction.x, direction.y).multiply(dist * 2),
      ),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection40 = line35.getIntersections(centerCircle);
  points.push(intersection40[0].point);
  line35.remove();
  line35 = createLine(
    [points[61], points[62]],
    settings.blueprint.guide23 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  dist = points[53].getDistance(points[61]);
  direction = points[53].subtract(points[61]).normalize();
  let line36 = createLine(
    [
      points[61],
      points[53].add(
        new paper.Point(direction.x, direction.y).multiply(dist * 2),
      ),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection41 = line36.getIntersections(centerCircle);
  points.push(intersection41[0].point);
  line36.remove();
  line36 = createLine(
    [points[61], points[63]],
    settings.blueprint.guide23 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  // points.push(intersection37[0].point);

  const intersection42 = line33.getIntersections(line36);
  points.push(intersection42[0].point);

  const intersection43 = line31.getIntersections(line35);
  points.push(intersection43[0].point);

  const direction44 = points[64].subtract(points[65]).normalize();

  let line37 = createLine(
    [
      new paper.Point(center.x - direction.x * radius * 1.5, points[64].y),
      new paper.Point(center.x + direction.x * radius * 1.5, points[64].y),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection44 = line37.getIntersections(centerCircle);
  points.push(intersection44[0].point, intersection44[1].point);
  line37.remove();
  line37 = createLine(
    [points[66], points[67]],
    settings.blueprint.guide24 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection45 = line37.getIntersections(line16);
  points.push(intersection45[0].point);

  const intersection46 = line15.getIntersections(line29);
  points.push(intersection46[0].point);

  direction = points[68].subtract(points[69]).normalize();
  let line38 = createLine(
    [
      points[69],
      points[68].add(
        new paper.Point(direction.x, direction.y).multiply(innerRadius),
      ),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection47 = line38.getIntersections(centerCircle);
  points.push(intersection47[0].point);
  line38.remove();
  line38 = createLine(
    [points[69], points[70]],
    settings.blueprint.guide25 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection48 = line37.getIntersections(line17);
  points.push(intersection48[0].point);

  direction = points[71].subtract(points[69]).normalize();
  let line39 = createLine(
    [
      points[69],
      points[71].add(
        new paper.Point(direction.x, direction.y).multiply(innerRadius),
      ),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );
  const intersection49 = line39.getIntersections(centerCircle);
  points.push(intersection49[0].point);
  line39.remove();
  line39 = createLine(
    [points[69], points[72]],
    settings.blueprint.guide25 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection50 = line27.getIntersections(cornerCircle2);
  points.push(intersection50[0].point);

  const intersection51 = line28.getIntersections(cornerCircle3);
  points.push(intersection51[0].point);

  direction = points[73].subtract(points[74]).normalize();
  let line40 = createLine(
    [
      new paper.Point(center.x - direction.x * innerRadius, points[73].y),
      new paper.Point(center.x + direction.x * innerRadius, points[74].y),
    ],
    debugStrokeColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection52 = line40.getIntersections(centerCircle);
  points.push(intersection52[0].point, intersection52[1].point);
  line40.remove();
  line40 = createLine(
    [points[75], points[76]],
    settings.blueprint.guide26 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const intersection53 = line40.getIntersections(line35);
  points.push(intersection53[0].point);

  const intersection54 = line40.getIntersections(line36);
  points.push(intersection54[0].point);

  const line41 = createLine(
    [points[77], points[12]],
    settings.blueprint.guide27 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const line42 = createLine(
    [points[78], points[12]],
    settings.blueprint.guide27 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  const line43 = createLine(
    [points[9], points[23]],
    settings.blueprint.guide28 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );
  const line44 = createLine(
    [points[8], points[24]],
    settings.blueprint.guide28 ? debugStrokeColor : transparentColor,
    settings.strokeWidth,
    blueprint,
  );

  // points.push(intersection50[0].point);

  const intersection55 = line26.getIntersections(line34);
  points.push(intersection55[0].point);

  const intersection56 = line25.getIntersections(line34);
  points.push(intersection56[0].point);

  const intersection57 = line29.getIntersections(line16);
  points.push(intersection57[0].point);

  const intersection58 = line29.getIntersections(line17);
  points.push(intersection58[0].point);

  const intersection59 = line22.getIntersections(line27);
  points.push(intersection59[0].point);

  const intersection60 = line22.getIntersections(line28);
  points.push(intersection60[0].point);

  const intersection61 = line14.getIntersections(line44);
  points.push(intersection61[0].point);

  const intersection62 = line14.getIntersections(line43);
  points.push(intersection62[0].point);

  // debugPoints(points, debugStrokeColor);

  // Triangles
  const line45 = createLine(
    [points[25], points[26], points[1], points[25]],
    settings.form.step0 ? settings.strokeColor : transparentColor,
    settings.strokeWidth,
    form,
  );

  const line46 = createLine(
    [points[22], points[21], points[3], points[22]],
    settings.form.step1 ? settings.strokeColor : transparentColor,
    settings.strokeWidth,
    form,
  );

  const line47 = createLine(
    [points[44], points[80], points[79], points[44]],
    settings.form.step2 ? settings.strokeColor : transparentColor,
    settings.strokeWidth,
    form,
  );

  const line48 = createLine(
    [points[31], points[81], points[82], points[31]],
    settings.form.step3 ? settings.strokeColor : transparentColor,
    settings.strokeWidth,
    form,
  );

  const line49 = createLine(
    [points[61], points[52], points[53], points[61]],
    settings.form.step4 ? settings.strokeColor : transparentColor,
    settings.strokeWidth,
    form,
  );

  const line50 = createLine(
    [points[69], points[68], points[71], points[69]],
    settings.form.step5 ? settings.strokeColor : transparentColor,
    settings.strokeWidth,
    form,
  );

  const line51 = createLine(
    [points[47], points[83], points[84], points[47]],
    settings.form.step6 ? settings.strokeColor : transparentColor,
    settings.strokeWidth,
    form,
  );

  const line52 = createLine(
    [points[12], points[77], points[78], points[12]],
    settings.form.step7 ? settings.strokeColor : transparentColor,
    settings.strokeWidth,
    form,
  );

  const line53 = createLine(
    [points[56], points[85], points[86], points[56]],
    settings.form.step8 ? settings.strokeColor : transparentColor,
    settings.strokeWidth,
    form,
  );

  const bindu = createCircle(
    center,
    innerRadius * 0.01,
    settings.form.step9 ? settings.strokeColor : transparentColor,
    settings.strokeWidth,
    form,
  );
  bindu.fillColor = settings.form.step9
    ? settings.strokeColor
    : transparentColor;
}
