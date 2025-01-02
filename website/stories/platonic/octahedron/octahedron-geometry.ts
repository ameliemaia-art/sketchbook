import paper from "paper";
import { MathUtils, Vector3 } from "three";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createGrid,
  createLine,
  debugPoints,
  dot,
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

export function octahedron(
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

  if (settings.layers.outline) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = settings.strokeColor;
    path.strokeWidth = settings.strokeWidth;
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
  //   settings.strokeWidth,
  //   20,
  //   true,
  //   30,
  //   new paper.Color(1, 0, 0, 1),
  // );

  const faces = [
    {
      label: "front top",
      vertices: [points[8], points[12], points[16], points[8]],
      normal: new Vector3(-0, 0.5773502588272095, 0.8164966106414795),
    },
    {
      label: "front bottom",
      vertices: [points[8], points[10], points[12], points[8]],
      normal: new Vector3(0, -0.5773502588272095, 0.8164966106414795),
    },
    {
      label: "front top left",
      vertices: [points[16], points[12], points[14], points[16]],
      normal: new Vector3(-0.8164966106414795, 0.5773502588272095, 0),
    },
    {
      label: "front top right",
      vertices: [points[16], points[18], points[8], points[16]],
      normal: new Vector3(0.8164966106414795, 0.5773502588272095, 0),
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

  createLine(
    [points[14], points[18]],
    settings.strokeDepthColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [points[14], points[10], points[18]],
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
    [points[12], points[16], points[8], points[12]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );

  return group;
}
