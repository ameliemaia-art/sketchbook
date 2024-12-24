import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createLine,
  debugPoints,
  lerp,
} from "../../../utils/paper/utils";

export function vectorEquilibrium(
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
  layer3 = true,
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
  const outlineRadius = radius - innerRadius;

  const startAngle = -Math.PI / 6;

  if (circlesVisible) {
    createCircle(center, innerRadius, strokeColor, strokeWidth, group);
  }

  const points: paper.Point[] = [];
  for (let i = 0; i < total; i++) {
    const theta = startAngle + (TWO_PI / total) * i;
    const x = center.x + Math.cos(theta) * outlineRadius;
    const y = center.y + Math.sin(theta) * outlineRadius;
    points.push(new paper.Point(x, y));
    if (circlesVisible) {
      createCircle(points[i], innerRadius, strokeColor, strokeWidth, group);
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

  if (structure) {
    createLine(
      [...hexagonPoints, hexagonPoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  // debugPoints(hexagonPoints, strokeColor);

  const innerBottomLeft = lerp(hexagonPoints[2], hexagonPoints[0], 1 / 3);
  const innerBottomRight = lerp(hexagonPoints[0], hexagonPoints[2], 1 / 3);
  const innerTopRight = lerp(hexagonPoints[5], hexagonPoints[3], 1 / 3);
  const innerTopLeft = lerp(hexagonPoints[3], hexagonPoints[5], 1 / 3);

  // Horizontal lines
  if (layer0) {
    createLine(
      [hexagonPoints[0], innerBottomRight],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [hexagonPoints[2], innerBottomLeft],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [hexagonPoints[5], innerTopRight],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [hexagonPoints[3], innerTopLeft],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [innerTopLeft, hexagonPoints[4], innerTopRight],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine(
      [innerBottomLeft, hexagonPoints[1], innerBottomRight],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  // Middle line
  const rightMid = lerp(hexagonPoints[5], hexagonPoints[0], 0.5);
  const leftMid = lerp(hexagonPoints[2], hexagonPoints[3], 0.5);
  const innerLineLeft = lerp(leftMid, rightMid, 1 / 6);
  const innerLineRight = lerp(rightMid, leftMid, 1 / 6);

  if (layer1) {
    // Vertical lines
    createLine(
      [innerTopRight, innerBottomRight],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [innerTopLeft, innerBottomLeft],
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

    // Diagonal lines

    createLine(
      [hexagonPoints[5], innerLineRight, hexagonPoints[0]],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [hexagonPoints[2], innerLineLeft, hexagonPoints[3]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  if (layer2) {
    // Cross lines
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
      [innerBottomLeft, innerLineRight],
      strokeColor,
      strokeWidth,
      group,
    );
    createLine(
      [innerBottomRight, innerLineLeft],
      strokeColor,
      strokeWidth,
      group,
    );

    createLine([innerTopLeft, innerLineRight], strokeColor, strokeWidth, group);
    createLine([innerTopRight, innerLineLeft], strokeColor, strokeWidth, group);
  }

  if (layer3) {
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
      [hexagonPoints[1], hexagonPoints[4]],
      strokeColor,
      strokeWidth,
      group,
    );
  }

  return group;
}
