import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, lerp } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type VectorEquilibriumSphericalSettings = {
  petalRadius: number;
  petalOffset: number;
  layers: {
    circles: boolean;
    structure: boolean;
    layer0: boolean;
    layer1: boolean;
    layer2: boolean;
  };
};

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
  settings: SketchSettings & VectorEquilibriumSphericalSettings,
) {
  const group = new paper.Group();

  if (settings.layers.outline) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    group.addChild(path);
  }

  // Line from center
  let total = 6;
  let innerRadius = radius / 3;

  const startAngle = -Math.PI / 6;

  if (settings.layers.circles) {
    createCircle(
      center,
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  const outlineRadius = radius - innerRadius;
  for (let i = 0; i < total; i++) {
    const theta = startAngle + (TWO_PI / total) * i;
    const x = center.x + Math.cos(theta) * outlineRadius;
    const y = center.y + Math.sin(theta) * outlineRadius;

    if (settings.layers.circles) {
      createCircle(
        new paper.Point(x, y),
        innerRadius,
        settings.strokeColor,
        settings.strokeWidth,
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

  if (settings.layers.structure) {
    createLine(
      [...hexagonPoints, hexagonPoints[0]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  const innerBottomLeft = lerp(hexagonPoints[2], hexagonPoints[0], 1 / 3);
  const innerBottomRight = lerp(hexagonPoints[0], hexagonPoints[2], 1 / 3);
  const innerTopRight = lerp(hexagonPoints[5], hexagonPoints[3], 1 / 3);
  const innerTopLeft = lerp(hexagonPoints[3], hexagonPoints[5], 1 / 3);

  // Petals
  if (settings.layers.layer0) {
    const petal = createPetal(
      center,
      radius,
      settings.strokeColor,
      settings.strokeWidth,
    );
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

  if (settings.layers.layer1) {
    // Lines
    createLine(
      [innerTopLeft, innerBottomRight],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [innerTopRight, innerBottomLeft],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [innerTopRight, innerBottomLeft],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [innerLineLeft, innerLineRight],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.layer2) {
    // Diagonals
    createLine(
      [hexagonPoints[5], hexagonPoints[2]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [hexagonPoints[3], hexagonPoints[0]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [hexagonPoints[4], hexagonPoints[1]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  return group;
}
