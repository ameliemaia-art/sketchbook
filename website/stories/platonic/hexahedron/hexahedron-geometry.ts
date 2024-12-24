import paper from "paper";
import { Vector3 } from "three";
import { MathUtils } from "three/src/math/MathUtils.js";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createLine,
  debugPoints,
  lerp,
} from "../../../utils/paper/utils";

export function hexahedron(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  guideColor: paper.Color,
  lightDirection: Vector3,
  outline = true,
) {
  const group = new paper.Group();

  if (outline) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = strokeColor;
    path.strokeWidth = strokeWidth;
    group.addChild(path);
  }

  const dimensions = 3;
  let total = 6;
  let innerRadius = radius / dimensions;

  const startAngle = -Math.PI / 6;

  const points: paper.Point[] = [];

  points.push(center);

  // Same setup as flowerOfLife
  for (let i = 0; i < dimensions - 1; i++) {
    const innerPoints: paper.Point[] = [];
    const outlineRadius = innerRadius * (i + 1);
    for (let j = 0; j < total; j++) {
      const theta = startAngle + (TWO_PI / total) * j;
      const x = center.x + Math.cos(theta) * outlineRadius;
      const y = center.y + Math.sin(theta) * outlineRadius;
      innerPoints.push(new paper.Point(x, y));
    }

    const length = innerPoints.length;
    for (let k = 0; k < length; k++) {
      const p0 = innerPoints[k];
      const p1 = innerPoints[k === length - 1 ? 0 : k + 1];

      const circlesPerDimension = i + 2;
      for (let l = 0; l < circlesPerDimension; l++) {
        if (l > 0) {
          const t = l / (circlesPerDimension - 1);
          const p = lerp(p0, p1, t);
          createCircle(p, innerRadius, guideColor, strokeWidth, group);
          points.push(p);
        }
      }
    }
  }

  // debugPoints(
  //   points,
  //   new paper.Color(0, 1, 0, 1),
  //   strokeWidth,
  //   20,
  //   true,
  //   30,
  //   new paper.Color(1, 0, 0, 1),
  // );

  // Draw lines

  createLine(
    [
      points[16],
      points[18],
      points[8],
      points[10],
      points[12],
      points[14],
      points[16],
    ],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [points[14], points[0], points[18]],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine([points[0], points[10]], strokeColor, strokeWidth, group);

  const faces = [
    {
      label: "right",
      vertices: [points[0], points[18], points[8], points[10], points[0]],
      normal: new Vector3(1, 0, 0),
    },
    {
      label: "left",
      vertices: [points[14], points[0], points[10], points[12], points[14]],
      normal: new Vector3(0, 0, 1),
    },
    {
      label: "top",
      vertices: [points[0], points[14], points[16], points[18], points[0]],
      normal: new Vector3(0, 1, 0),
    },
  ];

  for (const face of faces) {
    const path = new paper.Path();
    // path.strokeColor = strokeColor;
    // path.strokeWidth = strokeWidth;

    const intensity = MathUtils.clamp(face.normal.dot(lightDirection), 0, 1);

    const faceColor = new paper.Color(intensity, intensity, intensity, 0.5);

    path.fillColor = faceColor;
    face.vertices.forEach((vertex) => path.add(vertex));
    path.closed = true;
    group.addChild(path);
  }

  return group;
}
