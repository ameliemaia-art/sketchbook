import paper from "paper";
import { MathUtils, Vector3 } from "three";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createLine,
  debugPoints,
  lerp,
} from "../../../utils/paper/utils";

export function tetrahedron(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  guideColor: paper.Color,
  faceColor: paper.Color,
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

  const faces = [
    {
      label: "left",
      vertices: [points[16], points[0], points[12], points[16]],
      normal: new Vector3(
        -0.8164966106414795,
        0.4714045226573944,
        0.3333333432674408,
      ),
    },
    {
      label: "right",
      vertices: [points[16], points[8], points[0], points[16]],
      normal: new Vector3(
        0.8164966106414795,
        0.4714045226573944,
        0.3333333432674408,
      ),
    },
    {
      label: "bottom",
      vertices: [points[8], points[12], points[0], points[8]],
      normal: new Vector3(0, -0.9428090453147888, 0.3333333432674408),
    },
  ];

  for (const face of faces) {
    const path = new paper.Path();
    const intensity = MathUtils.clamp(face.normal.dot(lightDirection), 0, 1);

    path.fillColor = new paper.Color(
      faceColor.red * intensity,
      faceColor.green * intensity,
      faceColor.blue * intensity,
      faceColor.alpha,
    );
    face.vertices.forEach((vertex) => path.add(vertex));
    path.closed = true;
    group.addChild(path);
  }

  // Draw lines
  createLine(
    [points[12], points[16], points[8], points[12]],
    strokeColor,
    strokeWidth,
    group,
  );
  createLine(
    [points[12], points[0], points[8]],
    strokeColor,
    strokeWidth,
    group,
  );
  createLine([points[0], points[16]], strokeColor, strokeWidth, group);

  return group;
}
