import {
  DebugLineColor,
  DebugPointColor,
} from "@/stories/blueprints/sketch/constants";
import paper from "paper";
import { CatmullRomCurve3, MathUtils, Vector3 } from "three";

import {
  createCircle,
  createGrid,
  createLine,
  createPointOnCircle,
  lerp,
} from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type ColumnSettings = {
  blueprint: {};
  form: {
    flutes: number;
    fluteDepth: number;
    fluteGap: number;
    inset: number;
    insetCurveFactor: number;
    debug: boolean;
  };
  grid: {
    visible: boolean;
    opacity: number;
    divisions: number;
  };
};

function createFluteIndent(
  center: paper.Point,
  radius: number,
  angle1: number,
  angle2: number,
  theta: number,
  curveFactor: number,
  debug: boolean,
  form: paper.Group,
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
  if (debug) {
    createCircle(p1ControlPoint2, 2, DebugPointColor, 1, undefined, form);
    createLine(
      [p1ControlPoint2Point, p1ControlPoint2],
      DebugLineColor,
      1,
      form,
    );
  }
  return p1ControlPoint2;
}

function createFluteStart(
  p1: paper.Point,
  center: paper.Point,
  radius: number,
  theta: number,
  curveFactor: number,
  debug: boolean,
  form: paper.Group,
) {
  // Lets create the start point for the curve on the left
  const p1Normal = p1.clone().subtract(center).normalize();
  const p1Depth = p1.clone().subtract(p1Normal.multiply(radius * curveFactor));
  const p1ControlPoint0 = lerp(p1, p1Depth, theta);
  if (debug) {
    createLine([p1, p1Depth], DebugLineColor, 1, form);
    createCircle(p1Depth, 2, DebugPointColor, 1, undefined, form);
    createCircle(p1ControlPoint0, 2, DebugPointColor, 1, undefined, form);
  }
  return p1ControlPoint0;
}

// Function 1: Compute the curve points and gap endpoints.
export function computeGreekColumnShaftCurveData(
  center: paper.Point,
  radius: number,
  flutes: number,
  fluteGap: number,
  fluteDepth: number,
  inset: number,
  insetCurveFactor: number,
  debug: boolean,
  form: paper.Group,
): Array<{
  curvePoints: paper.Point[];
  gapLine: { start: paper.Point; end: paper.Point };
}> {
  const angleStep = (2 * Math.PI) / flutes;
  const angleOffset = fluteGap / radius / 2;
  const data = [];

  for (let i = 0; i < flutes; i++) {
    const angle1 = i * angleStep + angleOffset;
    const angle2 = (i + 1) * angleStep - angleOffset;

    // Outer points of the segment
    const p1 = createPointOnCircle(center, radius, angle1);
    const p2 = createPointOnCircle(center, radius, angle2);

    const controlPoints = [
      createFluteStart(p1, center, radius, 0, fluteDepth, debug, form),
      createFluteIndent(
        center,
        radius,
        angle1,
        angle2,
        inset,
        fluteDepth * insetCurveFactor,
        debug,
        form,
      ),
      createFluteIndent(
        center,
        radius,
        angle1,
        angle2,
        1 - inset,
        fluteDepth * insetCurveFactor,
        debug,
        form,
      ),
      createFluteStart(p2, center, radius, 0, fluteDepth, debug, form),
    ];

    const spline = controlPoints.map(
      (point) => new Vector3(point.x, point.y, 0),
    );
    const curve = new CatmullRomCurve3(spline, false, "catmullrom", 0.5);
    const points = curve.getPoints(20).map((pt) => new paper.Point(pt.x, pt.y));

    // Compute endpoints for the gap line.
    const nextIndex = (i + 1) % flutes;
    const nextAngle = nextIndex * angleStep + angleOffset;
    const p1Next = new paper.Point(
      center.x + radius * Math.cos(nextAngle),
      center.y + radius * Math.sin(nextAngle),
    );

    data.push({
      curvePoints: points,
      gapLine: { start: p2, end: p1Next },
    });
  }

  return data;
}

// Function 2: Draw the computed curves and gap lines.
function drawGreekColumnShaftFromData(
  curveData: Array<{
    curvePoints: paper.Point[];
    gapLine: { start: paper.Point; end: paper.Point };
  }>,
  strokeWidth: number,
  strokeColor: paper.Color,
  form: paper.Group,
): void {
  for (const segment of curveData) {
    // Draw the spline curve.
    const path = new paper.Path();
    path.strokeColor = strokeColor;
    path.strokeWidth = strokeWidth;
    path.add(segment.curvePoints[0]);
    for (let j = 1; j < segment.curvePoints.length; j++) {
      path.add(segment.curvePoints[j]);
    }
    form.addChild(path);

    // Draw the gap line.
    const gapPath = new paper.Path.Line(
      segment.gapLine.start,
      segment.gapLine.end,
    );
    gapPath.strokeColor = strokeColor;
    gapPath.strokeWidth = strokeWidth;
    form.addChild(gapPath);
  }
}

export function column(
  blueprint: paper.Group,
  form: paper.Group,
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: SketchSettings & ColumnSettings,
) {
  const gridColor = new paper.Color(1, 1, 1, settings.grid.opacity);

  if (settings.grid.visible) {
    createGrid(
      center,
      size,
      gridColor,
      settings.strokeWidth,
      settings.grid.divisions,
      form,
    );
    createGrid(center, size, gridColor, settings.strokeWidth, 5, form);
  }

  // Draw the outline circle
  if (settings.blueprint.cosmos) {
    const outlinePath = new paper.Path.Circle(center, radius);
    outlinePath.strokeColor = settings.strokeColor;
    outlinePath.strokeWidth = settings.strokeWidth;
    blueprint.addChild(outlinePath);
  }

  const curveData = computeGreekColumnShaftCurveData(
    center,
    radius,
    settings.form.flutes,
    settings.form.fluteGap * radius,
    settings.form.fluteDepth,
    settings.form.inset,
    settings.form.insetCurveFactor,
    settings.form.debug,
    form,
  );
  drawGreekColumnShaftFromData(
    curveData,
    settings.strokeWidth,
    settings.strokeColor,
    form,
  );
}
