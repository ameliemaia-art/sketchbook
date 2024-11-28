import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, lerp } from "../utils";

export function tetrahedron64(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  outlineVisible = false,
  circlesVisible = false,
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
  const dimensions = 2;
  let innerRadius = radius / dimensions;
  const startAngle = -Math.PI / 6;

  if (circlesVisible) {
    createCircle(center, innerRadius, strokeColor, strokeWidth, group);
  }

  // Same setup as flowerOfLife
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
        if (circlesVisible) {
          createCircle(p, innerRadius, strokeColor, strokeWidth, group);
        }
      }
    }
  }

  // Draw outer triangle
  let trianglePointsOuter: paper.Point[] = [];
  let length = 3;
  for (let i = 0; i < length; i++) {
    const theta = Math.PI / 6 + i * (TWO_PI / length);
    const x = center.x + Math.cos(theta) * radius;
    const y = center.y + Math.sin(theta) * radius;
    trianglePointsOuter.push(new paper.Point(x, y));
  }

  createLine(
    [...trianglePointsOuter, trianglePointsOuter[0]],
    strokeColor,
    strokeWidth,
    group,
  );

  // Draw inner triangle
  let trianglePointsInner: paper.Point[] = [];

  for (let i = 0; i < length; i++) {
    const theta = Math.PI / 6 + i * (TWO_PI / length);
    const x = center.x + Math.cos(theta) * innerRadius;
    const y = center.y + Math.sin(theta) * innerRadius;
    trianglePointsInner.push(new paper.Point(x, y));
  }

  createLine(
    [...trianglePointsInner, trianglePointsInner[0]],
    strokeColor,
    strokeWidth,
    group,
  );

  // Draw hexagon
  let hexagonPoints: paper.Point[] = [];

  length = 6;
  for (let i = 0; i < length; i++) {
    const theta = Math.PI / 6 + i * (TWO_PI / length);
    const x = center.x + Math.cos(theta) * radius;
    const y = center.y + Math.sin(theta) * radius;
    hexagonPoints.push(new paper.Point(x, y));
  }
  // createLine(
  //   [...hexagonPoints, hexagonPoints[0]],
  //   new paper.Color(0, 1, 0, 1),
  //   strokeWidth,
  //   group,
  // );

  // Bottom hexagon line
  createLine(
    [
      lerp(trianglePointsOuter[0], trianglePointsOuter[1], 5 / 6),
      lerp(hexagonPoints[1], hexagonPoints[2], 0.5),
      lerp(hexagonPoints[0], hexagonPoints[1], 0.5),
      lerp(trianglePointsOuter[0], trianglePointsOuter[1], 1 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Left hexagon line
  createLine(
    [
      lerp(trianglePointsOuter[1], trianglePointsOuter[2], 1 / 6),
      lerp(hexagonPoints[2], hexagonPoints[3], 0.5),
      lerp(hexagonPoints[3], hexagonPoints[4], 0.5),
      lerp(trianglePointsOuter[1], trianglePointsOuter[2], 5 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Right hexagon line
  createLine(
    [
      lerp(trianglePointsOuter[2], trianglePointsOuter[0], 1 / 6),
      lerp(hexagonPoints[4], hexagonPoints[5], 0.5),
      lerp(hexagonPoints[5], hexagonPoints[0], 0.5),
      lerp(trianglePointsOuter[2], trianglePointsOuter[0], 5 / 6),
      //
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Middle left and right corners of hexagon
  createLine(
    [
      lerp(hexagonPoints[5], hexagonPoints[0], 0.5),
      lerp(trianglePointsOuter[2], trianglePointsOuter[0], 4 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );
  createLine(
    [
      lerp(hexagonPoints[2], hexagonPoints[3], 0.5),
      lerp(trianglePointsOuter[1], trianglePointsOuter[2], 2 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Top left and right corners of hexagon
  createLine(
    [
      lerp(hexagonPoints[4], hexagonPoints[5], 0.5),
      lerp(trianglePointsOuter[2], trianglePointsOuter[0], 2 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );
  createLine(
    [
      lerp(hexagonPoints[3], hexagonPoints[4], 0.5),
      lerp(trianglePointsOuter[1], trianglePointsOuter[2], 4 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Bottom left and right corners of hexagon
  createLine(
    [
      lerp(hexagonPoints[0], hexagonPoints[1], 0.5),
      lerp(trianglePointsOuter[0], trianglePointsOuter[1], 2 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );
  createLine(
    [
      lerp(hexagonPoints[1], hexagonPoints[2], 0.5),
      lerp(trianglePointsOuter[0], trianglePointsOuter[1], 4 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Top corners of hexagon to tip of smaller triangle
  createLine(
    [lerp(hexagonPoints[4], hexagonPoints[5], 0.5), trianglePointsInner[2]],
    strokeColor,
    strokeWidth,
    group,
  );
  createLine(
    [lerp(hexagonPoints[3], hexagonPoints[4], 0.5), trianglePointsInner[2]],
    strokeColor,
    strokeWidth,
    group,
  );

  // Middle left and right corners
  createLine(
    [lerp(hexagonPoints[5], hexagonPoints[0], 0.5), trianglePointsInner[0]],
    strokeColor,
    strokeWidth,
    group,
  );
  createLine(
    [lerp(hexagonPoints[2], hexagonPoints[3], 0.5), trianglePointsInner[1]],
    strokeColor,
    strokeWidth,
    group,
  );
  // Bottom left and right corners
  createLine(
    [lerp(hexagonPoints[0], hexagonPoints[1], 0.5), trianglePointsInner[0]],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [lerp(hexagonPoints[1], hexagonPoints[2], 0.5), trianglePointsInner[1]],
    strokeColor,
    strokeWidth,
    group,
  );

  // Connect top corners of outer triangle
  createLine(
    [
      lerp(
        lerp(hexagonPoints[4], hexagonPoints[5], 0.5),
        trianglePointsInner[2],
        0.5,
      ),
      lerp(
        lerp(hexagonPoints[3], hexagonPoints[4], 0.5),
        trianglePointsInner[2],
        0.5,
      ),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Left corners of outer triangle
  createLine(
    [
      lerp(
        lerp(hexagonPoints[5], hexagonPoints[0], 0.5),
        trianglePointsInner[0],
        0.5,
      ),
      lerp(
        lerp(hexagonPoints[0], hexagonPoints[1], 0.5),
        trianglePointsInner[0],
        0.5,
      ),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [
      lerp(
        lerp(hexagonPoints[2], hexagonPoints[3], 0.5),
        trianglePointsInner[1],
        0.5,
      ),
      lerp(
        lerp(hexagonPoints[1], hexagonPoints[2], 0.5),
        trianglePointsInner[1],
        0.5,
      ),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [
      lerp(
        lerp(hexagonPoints[5], hexagonPoints[0], 0.5),
        trianglePointsInner[0],
        0.5,
      ),
      lerp(trianglePointsInner[2], trianglePointsInner[0], 5 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [
      lerp(
        lerp(hexagonPoints[2], hexagonPoints[3], 0.5),
        trianglePointsInner[1],
        0.5,
      ),
      lerp(trianglePointsInner[1], trianglePointsInner[2], 1 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [
      lerp(trianglePointsOuter[1], trianglePointsOuter[2], 5 / 6 - 1 / 6 / 2),
      lerp(trianglePointsInner[1], trianglePointsInner[2], 5 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [
      lerp(trianglePointsOuter[2], trianglePointsOuter[0], 1 / 6 + 1 / 6 / 2),
      lerp(trianglePointsInner[2], trianglePointsInner[0], 1 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [
      lerp(trianglePointsOuter[0], trianglePointsOuter[1], 1 / 6 + 1 / 6 / 2),
      lerp(trianglePointsInner[0], trianglePointsInner[1], 1 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [
      lerp(trianglePointsOuter[0], trianglePointsOuter[1], 5 / 6 - 1 / 6 / 2),
      lerp(trianglePointsInner[0], trianglePointsInner[1], 5 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Inverted triangle in the middle
  createLine(
    [
      lerp(trianglePointsInner[2], trianglePointsInner[0], 0.5),
      lerp(trianglePointsInner[0], trianglePointsInner[1], 0.5),
      lerp(trianglePointsInner[1], trianglePointsInner[2], 0.5),
      lerp(trianglePointsInner[2], trianglePointsInner[0], 0.5),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Inverted triangle on the sides
  createLine(
    [
      lerp(trianglePointsInner[2], trianglePointsInner[0], 4 / 6),
      lerp(trianglePointsOuter[2], trianglePointsOuter[0], 0.5),
      lerp(trianglePointsInner[2], trianglePointsInner[0], 2 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );
  createLine(
    [
      lerp(trianglePointsInner[1], trianglePointsInner[2], 2 / 6),
      lerp(trianglePointsOuter[1], trianglePointsOuter[2], 0.5),
      lerp(trianglePointsInner[1], trianglePointsInner[2], 4 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Inverted triangle on the bottom
  createLine(
    [
      lerp(trianglePointsInner[0], trianglePointsInner[1], 2 / 6),
      lerp(trianglePointsOuter[0], trianglePointsOuter[1], 0.5),
      lerp(trianglePointsInner[0], trianglePointsInner[1], 4 / 6),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Next layer of inverted triangles
  createLine(
    [
      lerp(trianglePointsOuter[2], trianglePointsOuter[0], 3 / 6 + 1 / 6 / 2),
      lerp(
        lerp(hexagonPoints[4], hexagonPoints[5], 0.5),
        lerp(hexagonPoints[5], hexagonPoints[0], 0.5),
        0.5,
      ),
      lerp(trianglePointsOuter[2], trianglePointsOuter[0], 2 / 6 + 1 / 6 / 2),
    ],
    strokeColor,
    strokeWidth,
    group,
  );
  createLine(
    [
      lerp(trianglePointsOuter[1], trianglePointsOuter[2], 2 / 6 + 1 / 6 / 2),
      lerp(
        lerp(hexagonPoints[2], hexagonPoints[3], 0.5),
        lerp(hexagonPoints[3], hexagonPoints[4], 0.5),
        0.5,
      ),
      lerp(trianglePointsOuter[1], trianglePointsOuter[2], 3 / 6 + 1 / 6 / 2),
    ],
    strokeColor,
    strokeWidth,
    group,
  );
  createLine(
    [
      lerp(trianglePointsOuter[0], trianglePointsOuter[1], 2 / 6 + 1 / 6 / 2),
      lerp(
        lerp(hexagonPoints[0], hexagonPoints[1], 0.5),
        lerp(hexagonPoints[1], hexagonPoints[2], 0.5),
        0.5,
      ),
      lerp(trianglePointsOuter[0], trianglePointsOuter[1], 3 / 6 + 1 / 6 / 2),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Inverted triangle underneath
  createLine(
    [
      lerp(
        lerp(hexagonPoints[4], hexagonPoints[5], 0.5),
        lerp(hexagonPoints[5], hexagonPoints[0], 0.5),
        4 / 6,
      ),
      hexagonPoints[5],
      lerp(
        lerp(hexagonPoints[4], hexagonPoints[5], 0.5),
        lerp(hexagonPoints[5], hexagonPoints[0], 0.5),
        2 / 6,
      ),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [
      lerp(
        lerp(hexagonPoints[2], hexagonPoints[3], 0.5),
        lerp(hexagonPoints[3], hexagonPoints[4], 0.5),
        2 / 6,
      ),
      hexagonPoints[3],
      lerp(
        lerp(hexagonPoints[2], hexagonPoints[3], 0.5),
        lerp(hexagonPoints[3], hexagonPoints[4], 0.5),
        4 / 6,
      ),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [
      lerp(
        lerp(hexagonPoints[0], hexagonPoints[1], 0.5),
        lerp(hexagonPoints[1], hexagonPoints[2], 0.5),
        2 / 6,
      ),
      hexagonPoints[1],
      lerp(
        lerp(hexagonPoints[0], hexagonPoints[1], 0.5),
        lerp(hexagonPoints[1], hexagonPoints[2], 0.5),
        4 / 6,
      ),
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  // Lines
  createLine([center, hexagonPoints[5]], strokeColor, strokeWidth, group);
  createLine([center, hexagonPoints[1]], strokeColor, strokeWidth, group);
  createLine([center, hexagonPoints[3]], strokeColor, strokeWidth, group);

  return group;
}
