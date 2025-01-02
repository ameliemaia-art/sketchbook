import paper from "paper";
import { Vector3 } from "three";
import { MathUtils } from "three/src/math/MathUtils.js";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createGrid,
  createLine,
  debugPoints,
  lerp,
} from "../../../utils/paper/utils";

export type SketchSettings = {
  scale: number;
  opacity: number;
  strokeWidth: number;
  strokeColor: paper.Color;
  strokeDepthColor: paper.Color;
  grid: {
    divisions: number;
    strokeWidth: number;
    strokeColor: paper.Color;
  };
  guide: {
    strokeColor: paper.Color;
    strokeWidth: number;
  };
  light: {
    enabled: boolean;
    direction: Vector3;
    intensity: number;
  };
  layers: {
    background: boolean;
    outline: boolean;
  };
};

export function hexahedron(
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: SketchSettings,
) {
  const group = new paper.Group();

  createGrid(
    center,
    size,
    settings.grid.strokeColor,
    settings.grid.strokeWidth,
    settings.grid.divisions,
    group,
  );
  createGrid(
    center,
    size,
    settings.grid.strokeColor,
    settings.grid.strokeWidth,
    5,
    group,
  );

  // if (outline) {
  //   const path = new paper.Path.Circle(center, radius);
  //   path.strokeColor = strokeColor;
  //   path.strokeWidth = strokeWidth;
  //   group.addChild(path);
  // }

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
          createCircle(
            p,
            innerRadius,
            settings.guide.strokeColor,
            settings.guide.strokeWidth,
            group,
          );
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

  if (settings.light.enabled) {
    for (const face of faces) {
      const path = new paper.Path();
      const intensity =
        MathUtils.clamp(face.normal.dot(settings.light.direction), 0, 1) *
        settings.light.intensity;

      path.fillColor = new paper.Color(intensity, intensity, intensity, 1);
      face.vertices.forEach((vertex) => path.add(vertex));
      path.closed = true;
      group.addChild(path);
    }
  }

  // Draw lines
  createLine(
    [points[12], points[0]],
    settings.strokeDepthColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [points[8], points[0]],
    settings.strokeDepthColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [points[0], points[16]],
    settings.strokeDepthColor,
    settings.strokeWidth,
    group,
  );

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
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );

  createLine(
    [points[14], points[0], points[18]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );

  createLine(
    [points[0], points[10]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );

  return group;
}
