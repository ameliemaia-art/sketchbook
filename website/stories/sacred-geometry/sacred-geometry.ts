import paper from "paper";
import { MathUtils } from "three";

import { TWO_PI } from "@utils/three/math";

export function dot(position: paper.Point, color?: paper.Color) {
  const path = new paper.Path.Circle(position, 5);
  // path.fillColor = new paper.Color(1, 0, 0, 1);
  path.fillColor = color ? color : new paper.Color(1, 0, 0, 1);
  return path;
}

export function lerp(p1: paper.Point, p2: paper.Point, t: number) {
  return new paper.Point(
    MathUtils.lerp(p1.x, p2.x, t),
    MathUtils.lerp(p1.y, p2.y, t),
  );
}

export function flowerOfLife(
  center: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
) {
  const group = new paper.Group();
  // const path = new paper.Path.Circle(center, radius);
  // path.strokeColor = strokeColor;
  // path.strokeWidth = strokeWidth;
  // group.addChild(path);

  // Helper to create and style circles
  const createCircle = (centerPoint, rad, strokeColor) => {
    const circle = new paper.Path.Circle(centerPoint, rad);
    circle.strokeColor = strokeColor;
    circle.strokeWidth = strokeWidth;
    group.addChild(circle);
  };
  const createLine = (p0, p1) => {
    const line = new paper.Path([p0, p1]);
    line.strokeColor = strokeColor;
    line.strokeWidth = strokeWidth;
    group.addChild(line);
  };

  // Line from center
  let total = 6;
  const innerRadius = radius / 3;
  const circleRadius = radius - innerRadius;
  const startAngle = -Math.PI / 6;
  const points: paper.Point[] = [];
  for (let i = 0; i < total; i++) {
    const theta = startAngle + (TWO_PI / total) * i;
    const x = center.x + Math.cos(theta) * circleRadius;
    const y = center.y + Math.sin(theta) * circleRadius;
    // createCircle(new paper.Point(x, y), innerRadius, strokeColor);
    points.push(new paper.Point(x, y));
  }

  // draw line between points
  const line = new paper.Path([...points, points[0]]);
  line.strokeColor = strokeColor;
  line.strokeWidth = strokeWidth;

  // dot(points[0], new paper.Color(1, 0, 0, 1));
  // dot(points[1], new paper.Color(0, 1, 0, 1));
  // dot(points[2], new paper.Color(0, 0, 1, 1));
  // dot(points[3], new paper.Color(0, 1, 1, 1));
  // dot(points[4], new paper.Color(1, 0, 1, 1));
  // dot(points[5], new paper.Color(1, 1, 0, 1));
  // dot(center, new paper.Color(1, 1, 0, 1));

  // Front lines of cube
  createLine(points[0], center);
  createLine(center, points[2]);
  createLine(center, points[4]);

  // Back lines of cube
  createLine(points[5], center);
  createLine(points[1], center);
  createLine(points[3], center);

  // Create layer

  // Bottom left corner
  const layers = 4;
  for (let i = 0; i < layers; i++) {
    for (let j = 0; j < layers; j++) {
      const x = lerp(points[3], points[2], i / (layers - 1));

      const y1 = lerp(points[3], points[4], j / (layers - 1));
      const y2 = lerp(points[2], center, j / (layers - 1));

      x.y = MathUtils.lerp(y1.y, y2.y, i / (layers - 1));

      dot(x, new paper.Color(1, 1, 1, 1));
    }
  }

  return group;
}
