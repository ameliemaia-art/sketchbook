import paper from "paper";
import { CatmullRomCurve3, MathUtils, Vector3 } from "three";

import { createCircle, createLine, lerp } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type ColumnSettings = {
  blueprint: {};
  form: {
    flutes: number;
    fluteDepth: number;
    fluteGap: number;
    inset: number;
    insetCurveFactor: number;
    midCurveFactor: number;
  };
};

function createPointOnCircle(
  center: paper.Point,
  radius: number,
  angle: number,
) {
  return new paper.Point(
    center.x + radius * Math.cos(angle),
    center.y + radius * Math.sin(angle),
  );
}

function createFluteIndent(
  center: paper.Point,
  radius: number,
  angle1: number,
  angle2: number,
  theta: number,
  curveFactor: number,
) {
  const p1ControlPoint2Angle = MathUtils.lerp(angle1, angle2, theta);
  const p1ControlPoint2Point = createPointOnCircle(
    center,
    radius,
    p1ControlPoint2Angle,
  );
  const p1ControlPoint2Normal = p1ControlPoint2Point
    .clone()
    .subtract(center)
    .normalize();
  const p1ControlPoint2 = p1ControlPoint2Point
    .clone()
    .subtract(p1ControlPoint2Normal.multiply(radius * curveFactor));
  // createCircle(p1ControlPoint2, 2, new paper.Color(1, 1, 0, 1), 1);
  // createLine(
  //   [p1ControlPoint2Point, p1ControlPoint2],
  //   new paper.Color(1, 0, 0, 1),
  //   1,
  // );
  return p1ControlPoint2;
}

function createFluteStart(
  p1: paper.Point,
  center: paper.Point,
  radius: number,
  theta: number,
  curveFactor: number,
) {
  // Lets create the start point for the curve on the left
  const p1Normal = p1.clone().subtract(center).normalize();
  const p1Depth = p1.clone().subtract(p1Normal.multiply(radius * curveFactor));
  const p1ControlPoint0 = lerp(p1, p1Depth, theta);
  // Debug
  // const color = new paper.Color(1, 1, 0, 1);
  // createLine([p1, p1Depth], new paper.Color(1, 0, 0, 1), 1);
  // createCircle(p1Depth, 2, color, 1);
  // createCircle(p1ControlPoint0, 2, color, 1);
  return p1ControlPoint0;
}

function drawGreekColumnShaft(
  center: paper.Point,
  radius: number,
  divisions: number,
  gap: number,
  curveFactor: number,
  inset: number = 0.15,
  insetCurveFactor: number = 0.5,
  midCurveFactor: number = 1.25,
) {
  const angleStep = (2 * Math.PI) / divisions;

  // Convert pixel gap to angular offset at the circle's edge
  const angleOffset = gap / radius / 2; // half on each side

  for (let i = 0; i < divisions; i++) {
    const angle1 = i * angleStep + angleOffset;
    const angle2 = (i + 1) * angleStep - angleOffset;

    // Outer points of the segment
    const p1 = createPointOnCircle(center, radius, angle1);
    const p2 = createPointOnCircle(center, radius, angle2);

    const start = 0;

    const controlPoints = [
      createFluteStart(p1, center, radius, start, curveFactor),
      createFluteIndent(
        center,
        radius,
        angle1,
        angle2,
        inset,
        curveFactor * insetCurveFactor,
      ),
      createFluteIndent(
        center,
        radius,
        angle1,
        angle2,
        0.5,
        curveFactor * midCurveFactor,
      ),
      createFluteIndent(
        center,
        radius,
        angle1,
        angle2,
        1 - inset,
        curveFactor * insetCurveFactor,
      ),
      createFluteStart(p2, center, radius, start, curveFactor),
    ];

    const spline = controlPoints.map(
      (point) => new Vector3(point.x, point.y, 0),
    );

    const curve = new CatmullRomCurve3(spline, false, "catmullrom", 0.5);
    const points = curve.getPoints(20);
    const path = new paper.Path();
    path.strokeColor = new paper.Color(1, 1, 1, 1);
    path.strokeWidth = 1;
    path.add(new paper.Point(points[0].x, points[0].y));
    for (let j = 1; j < points.length; j++) {
      path.add(new paper.Point(points[j].x, points[j].y));
    }
    path.smooth();
    path.fullySelected = false;

    // // Midpoint between p1 and p2
    // const midAngle = MathUtils.lerp(angle2, angle1, 0.5);

    // const mid = createPointOnCircle(center, radius, midAngle);

    // // Inward control point for curvature
    // const normal = mid.subtract(center).normalize();
    // const control = mid.subtract(normal.multiply(radius * curveFactor));

    // const segment = new paper.Path();
    // segment.add(p1);
    // segment.quadraticCurveTo(control, p2);
    // segment.strokeColor = new paper.Color(1, 1, 1, 1);

    // Compute end point of current flute (already available as p2)
    // Compute start point of next flute
    const nextIndex = (i + 1) % divisions;
    const nextAngle = nextIndex * angleStep + angleOffset;
    const p1Next = new paper.Point(
      center.x + radius * Math.cos(nextAngle),
      center.y + radius * Math.sin(nextAngle),
    );

    // Draw a short line between current p2 and next p1
    const gapLine = new paper.Path.Line(p2, p1Next);
    gapLine.strokeColor = new paper.Color(1, 1, 1, 1); // solid white
    gapLine.strokeWidth = 1;
  }
}

export function column(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  radius: number,
  settings: SketchSettings & ColumnSettings,
) {
  const transparentColor = new paper.Color(0, 0, 0, 0);

  // Draw the outline circle
  if (settings.blueprint.cosmos) {
    const outlinePath = new paper.Path.Circle(center, radius);
    outlinePath.strokeColor = settings.strokeColor;
    outlinePath.strokeWidth = settings.strokeWidth;
    blueprint.addChild(outlinePath);
  }

  drawGreekColumnShaft(
    center,
    radius,
    settings.form.flutes,
    settings.form.fluteGap * radius,
    settings.form.fluteDepth,
    settings.form.inset,
    settings.form.insetCurveFactor,
    settings.form.midCurveFactor,
  );
}
