import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, lerp } from "../../../utils/paper/utils";
import { SketchSettings } from "../sketch/sketch";

export type Tetrahedron64Settings = {
  layers: {
    circles: boolean;
    triangles: boolean;
    hexagon: boolean;
    layer0: boolean;
    layer1: boolean;
    layer2: boolean;
    layer3: boolean;
    layer4: boolean;
    layer5: boolean;
  };
};

export function tetrahedron64(
  center: paper.Point,
  radius: number,
  settings: SketchSettings,
) {
  const group = new paper.Group();
  const total = 6;
  const dimensions = 2;
  const innerRadius = radius / dimensions;
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
        if (settings.layers.circles) {
          createCircle(
            p,
            innerRadius,
            settings.strokeColor,
            settings.strokeWidth,
            group,
          );
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
  if (settings.layers.triangles) {
    createLine(
      [...trianglePointsOuter, trianglePointsOuter[0]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  // Draw inner triangle
  let trianglePointsInner: paper.Point[] = [];

  for (let i = 0; i < length; i++) {
    const theta = Math.PI / 6 + i * (TWO_PI / length);
    const x = center.x + Math.cos(theta) * innerRadius;
    const y = center.y + Math.sin(theta) * innerRadius;
    trianglePointsInner.push(new paper.Point(x, y));
  }

  if (settings.layers.triangles) {
    createLine(
      [...trianglePointsInner, trianglePointsInner[0]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

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

  if (settings.layers.hexagon) {
    // Bottom hexagon line
    createLine(
      [
        lerp(trianglePointsOuter[0], trianglePointsOuter[1], 5 / 6),
        lerp(hexagonPoints[1], hexagonPoints[2], 0.5),
        lerp(hexagonPoints[0], hexagonPoints[1], 0.5),
        lerp(trianglePointsOuter[0], trianglePointsOuter[1], 1 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    // Middle left and right corners of hexagon
  }

  if (settings.layers.layer0) {
    createLine(
      [
        lerp(hexagonPoints[5], hexagonPoints[0], 0.5),
        lerp(trianglePointsOuter[2], trianglePointsOuter[0], 4 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [
        lerp(hexagonPoints[2], hexagonPoints[3], 0.5),
        lerp(trianglePointsOuter[1], trianglePointsOuter[2], 2 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    // Top left and right corners of hexagon
    createLine(
      [
        lerp(hexagonPoints[4], hexagonPoints[5], 0.5),
        lerp(trianglePointsOuter[2], trianglePointsOuter[0], 2 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [
        lerp(hexagonPoints[3], hexagonPoints[4], 0.5),
        lerp(trianglePointsOuter[1], trianglePointsOuter[2], 4 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    // Bottom left and right corners of hexagon
    createLine(
      [
        lerp(hexagonPoints[0], hexagonPoints[1], 0.5),
        lerp(trianglePointsOuter[0], trianglePointsOuter[1], 2 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [
        lerp(hexagonPoints[1], hexagonPoints[2], 0.5),
        lerp(trianglePointsOuter[0], trianglePointsOuter[1], 4 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.layer1) {
    // Top corners of hexagon to tip of smaller triangle
    createLine(
      [lerp(hexagonPoints[4], hexagonPoints[5], 0.5), trianglePointsInner[2]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [lerp(hexagonPoints[3], hexagonPoints[4], 0.5), trianglePointsInner[2]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    // Middle left and right corners
    createLine(
      [lerp(hexagonPoints[5], hexagonPoints[0], 0.5), trianglePointsInner[0]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [lerp(hexagonPoints[2], hexagonPoints[3], 0.5), trianglePointsInner[1]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    // Bottom left and right corners
    createLine(
      [lerp(hexagonPoints[0], hexagonPoints[1], 0.5), trianglePointsInner[0]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [lerp(hexagonPoints[1], hexagonPoints[2], 0.5), trianglePointsInner[1]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.layer2) {
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
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [
        lerp(trianglePointsOuter[1], trianglePointsOuter[2], 5 / 6 - 1 / 6 / 2),
        lerp(trianglePointsInner[1], trianglePointsInner[2], 5 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [
        lerp(trianglePointsOuter[2], trianglePointsOuter[0], 1 / 6 + 1 / 6 / 2),
        lerp(trianglePointsInner[2], trianglePointsInner[0], 1 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [
        lerp(trianglePointsOuter[0], trianglePointsOuter[1], 1 / 6 + 1 / 6 / 2),
        lerp(trianglePointsInner[0], trianglePointsInner[1], 1 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    createLine(
      [
        lerp(trianglePointsOuter[0], trianglePointsOuter[1], 5 / 6 - 1 / 6 / 2),
        lerp(trianglePointsInner[0], trianglePointsInner[1], 5 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.layer3) {
    // Inverted triangle in the middle
    createLine(
      [
        lerp(trianglePointsInner[2], trianglePointsInner[0], 0.5),
        lerp(trianglePointsInner[0], trianglePointsInner[1], 0.5),
        lerp(trianglePointsInner[1], trianglePointsInner[2], 0.5),
        lerp(trianglePointsInner[2], trianglePointsInner[0], 0.5),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );

    // Inverted triangle on the sides
    createLine(
      [
        lerp(trianglePointsInner[2], trianglePointsInner[0], 4 / 6),
        lerp(trianglePointsOuter[2], trianglePointsOuter[0], 0.5),
        lerp(trianglePointsInner[2], trianglePointsInner[0], 2 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [
        lerp(trianglePointsInner[1], trianglePointsInner[2], 2 / 6),
        lerp(trianglePointsOuter[1], trianglePointsOuter[2], 0.5),
        lerp(trianglePointsInner[1], trianglePointsInner[2], 4 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.layer4) {
    // Inverted triangle on the bottom
    createLine(
      [
        lerp(trianglePointsInner[0], trianglePointsInner[1], 2 / 6),
        lerp(trianglePointsOuter[0], trianglePointsOuter[1], 0.5),
        lerp(trianglePointsInner[0], trianglePointsInner[1], 4 / 6),
      ],
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
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
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  if (settings.layers.layer5) {
    // Lines
    createLine(
      [center, hexagonPoints[5]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [center, hexagonPoints[1]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
    createLine(
      [center, hexagonPoints[3]],
      settings.strokeColor,
      settings.strokeWidth,
      group,
    );
  }

  return group;
}
