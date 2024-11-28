import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, debugPoints, lerp } from "../utils";

function createPetal(
  center: paper.Point,
  outlineRadius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
) {
  const group = new paper.Group();

  const r = (3 / 2 + 1 / 84) * outlineRadius;
  const offset = r * (4 / 6 + 1 / 6 / 2);

  // Create the first circle
  const c0 = new paper.Path.Circle(
    new paper.Point(center.x - offset, center.y),
    r,
  );
  c0.strokeColor = new paper.Color(1, 0, 0, 1);
  c0.strokeWidth = strokeWidth;

  // Create the second circle
  const c1 = new paper.Path.Circle(
    new paper.Point(center.x + offset, center.y),
    r,
  );
  c1.strokeColor = new paper.Color(1, 0, 0, 1);
  c1.strokeWidth = strokeWidth;

  // Intersect the two circles to create the petal shape
  const petal = c0.intersect(c1);
  petal.strokeColor = strokeColor;
  petal.strokeWidth = strokeWidth;

  // Add the petal to the group
  group.addChild(petal);

  // Remove debugging circles if not needed
  c0.remove();
  c1.remove();

  return group;
}

export function vectorEquilibriumSpherical(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  outlineVisible = false,
  circlesVisible = false,
  structure = true,
  layer0 = true,
  layer1 = true,
  layer2 = true,
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
  let innerRadius = radius / 3;

  const startAngle = -Math.PI / 6;

  if (circlesVisible) {
    createCircle(center, innerRadius, strokeColor, strokeWidth, group);
  }

  const outlineRadius = radius - innerRadius;
  for (let i = 0; i < total; i++) {
    const theta = startAngle + (TWO_PI / total) * i;
    const x = center.x + Math.cos(theta) * outlineRadius;
    const y = center.y + Math.sin(theta) * outlineRadius;

    if (circlesVisible) {
      createCircle(
        new paper.Point(x, y),
        innerRadius,
        strokeColor,
        strokeWidth,
        group,
      );
    }
  }

  // Hexagon
  let hexagonPoints: paper.Point[] = [];

  const length = 6;
  for (let i = 0; i < length; i++) {
    const theta = Math.PI / 6 + i * (TWO_PI / length);
    const x = center.x + Math.cos(theta) * radius;
    const y = center.y + Math.sin(theta) * radius;
    hexagonPoints.push(new paper.Point(x, y));
  }

  if (structure) {
    createLine(
      [...hexagonPoints, hexagonPoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  const innerBottomLeft = lerp(hexagonPoints[2], hexagonPoints[0], 1 / 3);
  const innerBottomRight = lerp(hexagonPoints[0], hexagonPoints[2], 1 / 3);
  const innerTopRight = lerp(hexagonPoints[5], hexagonPoints[3], 1 / 3);
  const innerTopLeft = lerp(hexagonPoints[3], hexagonPoints[5], 1 / 3);

  // Petals
  if (layer0) {
    const petal = createPetal(center, radius, strokeColor, strokeWidth);
    const petal2 = petal.clone();
    petal2.rotate(60, center);
    const petal3 = petal.clone();
    petal3.rotate(120, center);
  }

  // Middle line
  const rightMid = lerp(hexagonPoints[5], hexagonPoints[0], 0.5);
  const leftMid = lerp(hexagonPoints[2], hexagonPoints[3], 0.5);
  const innerLineLeft = lerp(leftMid, rightMid, 1 / 6);
  const innerLineRight = lerp(rightMid, leftMid, 1 / 6);

  if (layer1) {
    // Lines
    createLine(
      [innerTopLeft, innerBottomRight],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [innerTopRight, innerBottomLeft],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [innerTopRight, innerBottomLeft],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [innerLineLeft, innerLineRight],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  if (layer2) {
    // Diagonals
    createLine(
      [hexagonPoints[5], hexagonPoints[2]],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [hexagonPoints[3], hexagonPoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [hexagonPoints[4], hexagonPoints[1]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  return group;
}
