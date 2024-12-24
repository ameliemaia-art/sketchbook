import paper from "paper";
import { MathUtils, Vector3 } from "three";

import { TWO_PI } from "@utils/three/math";
import {
  createCircle,
  createLine,
  debugPoints,
  dot,
  lerp,
} from "../../../utils/paper/utils";

export function icosahedron(
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
      label: "front",
      vertices: [center, points[2], points[4], points[6], points[2], center],
      normal: new Vector3(-0, 0.15806913375854492, 0.9874280691146851),
    },
    {
      label: "front left triangle",
      vertices: [points[2], points[12], points[4], points[2]],
      normal: new Vector3(
        -0.5773502588272095,
        -0.21132490038871765,
        0.7886751294136047,
      ),
    },
    {
      label: "front top triangle",
      vertices: [points[6], points[4], points[16], points[6], center],
      normal: new Vector3(0, 0.776103138923645, 0.630605936050415),
    },
    {
      label: "front right triangle",
      vertices: [points[8], points[2], points[6], points[8]],
      normal: new Vector3(
        0.5773502588272095,
        -0.21132490038871765,
        0.7886751294136047,
      ),
    },
    {
      label: "bottom left",
      vertices: [points[10], points[12], points[2], points[10]],
      normal: new Vector3(
        -0.35682210326194763,
        -0.8090169429779053,
        0.46708622574806213,
      ),
    },
    {
      label: "bottom right",
      vertices: [points[10], points[2], points[8], points[10]],
      normal: new Vector3(
        0.35682210326194763,
        -0.8090169429779053,
        0.46708622574806213,
      ),
    },
    {
      label: "top left",
      vertices: [points[4], points[14], points[16], points[4]],
      normal: new Vector3(
        -0.5773502588272095,
        0.7886751294136047,
        0.21132487058639526,
      ),
    },
    {
      label: "top right",
      vertices: [points[6], points[16], points[18], points[6]],
      normal: new Vector3(
        0.5773502588272095,
        0.7886751294136047,
        0.21132487058639526,
      ),
    },
    {
      label: "left",
      vertices: [points[4], points[12], points[14], points[4]],
      normal: new Vector3(
        -0.9341723918914795,
        0.17841103672981262,
        0.30901697278022766,
      ),
    },
    {
      label: "right",
      vertices: [points[6], points[18], points[8], points[6]],
      normal: new Vector3(
        0.9341723918914795,
        0.17841103672981262,
        0.30901697278022766,
      ),
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
    [points[12], points[16], points[8], points[12]],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine(
    [points[4], points[6], points[2], points[4]],
    strokeColor,
    strokeWidth,
    group,
  );

  createLine([points[4], points[14]], strokeColor, strokeWidth, group);
  createLine([points[6], points[18]], strokeColor, strokeWidth, group);
  createLine([points[2], points[10]], strokeColor, strokeWidth, group);

  return group;
}
