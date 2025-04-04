import paper from "paper";
import { MathUtils } from "three";

import { createCircle } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type ColumnSettings = {
  blueprint: {};
  form: {
    flutes: number;
    fluteDepth: number;
    fluteGap: number;
  };
};

function drawGreekColumnShaft(
  center: paper.Point,
  radius: number,
  divisions: number,
  gap: number,
  curveFactor: number,
) {
  const angleStep = (2 * Math.PI) / divisions;

  // Convert pixel gap to angular offset at the circle's edge
  const angleOffset = gap / radius / 2; // half on each side

  for (let i = 0; i < divisions; i++) {
    const angle1 = i * angleStep + angleOffset;
    const angle2 = (i + 1) * angleStep - angleOffset;

    // Outer points of the segment
    const p1 = new paper.Point(
      center.x + radius * Math.cos(angle1),
      center.y + radius * Math.sin(angle1),
    );

    const p2 = new paper.Point(
      center.x + radius * Math.cos(angle2),
      center.y + radius * Math.sin(angle2),
    );

    // Midpoint between p1 and p2
    const midAngle = MathUtils.lerp(angle2, angle1, 0.5);

    const mid = new paper.Point(
      center.x + radius * Math.cos(midAngle),
      center.y + radius * Math.sin(midAngle),
    );

    // Inward control point for curvature
    const normal = mid.subtract(center).normalize();
    const control = mid.subtract(normal.multiply(radius * curveFactor));

    // Create curved path segment
    const segment = new paper.Path();
    segment.add(p1);
    segment.quadraticCurveTo(control, p2);
    segment.strokeColor = new paper.Color(1, 1, 1, 1);

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
  );
}
