import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { lerp } from "../../../utils/paper/utils";

export function createFlowerCircle(
  center: paper.Point,
  innerRadius: number,
  startAngle: number,
  strokeColor: paper.Color,
  strokeWidth: number,
) {
  const group = new paper.Group();

  const total = 6;
  const points: paper.Point[] = [];
  const outlineRadius = innerRadius;
  for (let j = 0; j < total; j++) {
    const theta = startAngle + (TWO_PI / total) * j;
    const x = center.x + Math.cos(theta) * outlineRadius;
    const y = center.y + Math.sin(theta) * outlineRadius;
    points.push(new paper.Point(x, y));
  }

  // const line = new paper.Path([...points, points[0]]);
  // line.strokeColor = strokeColor;
  // line.strokeWidth = strokeWidth;

  const c0 = new paper.Path.Circle(
    new paper.Point(points[0].x, lerp(points[0], points[1], 0.5).y),
    innerRadius,
  );
  c0.strokeColor = strokeColor;
  c0.strokeWidth = strokeWidth;
  const c1 = new paper.Path.Circle(
    new paper.Point(points[3].x, lerp(points[3], points[4], 0.5).y),
    innerRadius,
  );
  c1.strokeColor = strokeColor;
  c1.strokeWidth = strokeWidth;

  // Intersection path of the petal
  const petal = c0.intersect(c1);

  c0.remove();
  c1.remove();

  for (let i = 0; i < total; i++) {
    // Center petals
    let angle = 360 / total;
    const centerPetal = petal.clone();
    centerPetal.position.y = points[4].y;
    centerPetal.rotate(angle * i, center);
  }
  petal.remove();
  return group;
}

export function germOfLife(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  universe = false,
  creation = true,
) {
  const group = new paper.Group();

  if (universe) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = strokeColor;
    path.strokeWidth = strokeWidth;
    group.addChild(path);
  }

  const startAngle = -Math.PI / 6;

  if (creation) {
    createFlowerCircle(center, radius, startAngle, strokeColor, strokeWidth);
  }

  return group;
}
