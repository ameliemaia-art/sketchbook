import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, lerp } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type VectorEquilibriumSettings = {
  layers: {
    circles: boolean;
    structure: boolean;
    layer0: boolean;
    layer1: boolean;
    layer2: boolean;
    layer3: boolean;
  };
};

export function vectorEquilibrium(
  center: paper.Point,
  radius: number,
  settings: SketchSettings & VectorEquilibriumSettings,
) {
  const group = new paper.Group();
  const total = 6;
  const innerRadius = radius / 3;
  const outlineRadius = radius - innerRadius;
  const startAngle = -Math.PI / 6;

  if (settings.layers.light) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
    group.addChild(path);
  }

  if (settings.layers.circles) {
    createCircle(
      center,
      innerRadius,
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  const points: paper.Point[] = [];
  for (let i = 0; i < total; i++) {
    const theta = startAngle + (TWO_PI / total) * i;
    const x = center.x + Math.cos(theta) * outlineRadius;
    const y = center.y + Math.sin(theta) * outlineRadius;
    points.push(new paper.Point(x, y));
    if (settings.layers.circles) {
      createCircle(
        points[i],
        innerRadius,
        settings.strokeColor,
        settings.strokeWidth,
        group,
      );
    }
  }

  // Hexagon
  let hexagonPoints: paper.Point[] = [];

  length = 6;
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

  // debugPoints(hexagonPoints, strokeColor);

  const innerBottomLeft = lerp(hexagonPoints[2], hexagonPoints[0], 1 / 3);
  const innerBottomRight = lerp(hexagonPoints[0], hexagonPoints[2], 1 / 3);
  const innerTopRight = lerp(hexagonPoints[5], hexagonPoints[3], 1 / 3);
  const innerTopLeft = lerp(hexagonPoints[3], hexagonPoints[5], 1 / 3);

  // Horizontal lines
  if (settings.layers.layer0) {
    createLine(
      [hexagonPoints[0], innerBottomRight],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [hexagonPoints[2], innerBottomLeft],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [hexagonPoints[5], innerTopRight],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [hexagonPoints[3], innerTopLeft],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [innerTopLeft, hexagonPoints[4], innerTopRight],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [innerBottomLeft, hexagonPoints[1], innerBottomRight],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  // Middle line
  const rightMid = lerp(hexagonPoints[5], hexagonPoints[0], 0.5);
  const leftMid = lerp(hexagonPoints[2], hexagonPoints[3], 0.5);
  const innerLineLeft = lerp(leftMid, rightMid, 1 / 6);
  const innerLineRight = lerp(rightMid, leftMid, 1 / 6);

  if (settings.layers.layer1) {
    // Vertical lines
    createLine(
      [innerTopRight, innerBottomRight],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [innerTopLeft, innerBottomLeft],
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

    // Diagonal lines

    createLine(
      [hexagonPoints[5], innerLineRight, hexagonPoints[0]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [hexagonPoints[2], innerLineLeft, hexagonPoints[3]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.layer2) {
    // Cross lines
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
      [innerBottomLeft, innerLineRight],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [innerBottomRight, innerLineLeft],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [innerTopLeft, innerLineRight],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [innerTopRight, innerLineLeft],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.layer3) {
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
      [hexagonPoints[1], hexagonPoints[4]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  return group;
}
