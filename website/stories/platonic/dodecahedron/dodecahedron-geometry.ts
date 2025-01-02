import paper from "paper";
import { MathUtils, Vector3 } from "three";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createGrid,
  createLine,
  debugPoints,
  filterIntersectionPositions,
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
    trokeWidth: number;
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

function getLineIntersections(
  line: paper.Path.Line,
  lines: paper.Path.Line[],
  result: paper.Point[],
) {
  const intersections: paper.CurveLocation[] = [];

  lines.forEach((line2) => {
    // @ts-ignore
    if (line2._index === line._index) {
      return;
    }
    intersections.push(...line.getIntersections(line2));
  });

  result.push(...intersections.map((intersection) => intersection.point));
}

export function dodecahedron(
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

  const dimensions = 5;
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
            settings.strokeWidth,
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

  const lines: paper.Path.Line[] = [];

  // Draw lines
  createLine(
    [points[56], points[40], points[48], points[56]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[44], points[52], points[60], points[44]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );

  createLine(
    [points[56], points[8]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[56], points[12]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[60], points[14]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[52], points[18]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[60], points[10]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[52], points[10]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[40], points[16]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[48], points[16]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[40], points[12]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[48], points[8]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[44], points[18]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );
  createLine(
    [points[44], points[14]],
    settings.guide.strokeColor,
    settings.strokeWidth,
    group,
    lines,
  );

  let intersections: paper.Point[] = [];

  lines.forEach((line) => {
    getLineIntersections(line, lines, intersections);
  });

  intersections = filterIntersectionPositions(intersections);

  // debugPoints(
  //   intersections,
  //   new paper.Color(1, 0, 0, 1),
  //   settings.strokeWidth,
  //   10,
  //   true,
  //   20,
  //   new paper.Color(1, 1, 0, 1),
  // );

  const faces = [
    {
      label: "bottom",
      vertices: [
        center,
        intersections[48],
        intersections[16],
        intersections[17],
        intersections[52],
        center,
      ],
      normal: new Vector3(
        -0.5257311463356018,
        -0.4253253936767578,
        -0.7366852164268494,
      ),
    },
    {
      label: "left bottom",
      vertices: [
        intersections[52],
        intersections[17],
        intersections[28],
        intersections[26],
        intersections[13],
        intersections[52],
      ],
      normal: new Vector3(
        -0.8506507873535156,
        -0.45529651641845703,
        0.2628655731678009,
      ),
    },
    {
      label: "right bottom",
      vertices: [
        intersections[48],
        intersections[11],
        intersections[25],
        intersections[27],
        intersections[16],
        intersections[48],
      ],
      normal: new Vector3(
        0.5257311463356018,
        -0.4253253936767578,
        -0.7366852164268494,
      ),
    },
    {
      label: "top left",
      vertices: [
        intersections[40],
        center,
        intersections[52],
        intersections[13],
        intersections[10],
        intersections[40],
      ],
      normal: new Vector3(
        -0.525731086730957,
        0.4253254234790802,
        0.7366852164268494,
      ),
    },
    {
      label: "top right",
      vertices: [
        intersections[40],
        intersections[7],
        intersections[11],
        intersections[48],
        center,
        intersections[40],
      ],
      normal: new Vector3(
        0.8506508469581604,
        0.45529645681381226,
        -0.2628655433654785,
      ),
    },
    {
      label: "top",
      vertices: [
        intersections[40],
        intersections[10],
        intersections[21],
        intersections[18],
        intersections[7],
        intersections[40],
      ],
      normal: new Vector3(0, 0.9995507597923279, 0.02997102402150631),
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
    [intersections[21], intersections[18]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[7], intersections[11]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[25], intersections[27]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[16], intersections[17]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[28], intersections[26]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[13], intersections[10]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[18], intersections[7]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[11], intersections[25]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[27], intersections[16]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[17], intersections[28]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[26], intersections[13]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[10], intersections[21]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[13], intersections[52], intersections[17]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[11], intersections[48], intersections[16]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[10], intersections[40], intersections[7]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [intersections[52], center, intersections[48]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );
  createLine(
    [center, intersections[40]],
    settings.strokeColor,
    settings.strokeWidth,
    group,
  );

  return group;
}
