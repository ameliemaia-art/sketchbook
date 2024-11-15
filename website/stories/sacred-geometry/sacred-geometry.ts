import paper from "paper";
import { MathUtils } from "three";

import { TWO_PI } from "@utils/three/math";

function dot(
  position: paper.Point,
  radius: number,
  group?: paper.Group,
  color?: paper.Color,
) {
  const path = new paper.Path.Circle(position, radius);
  // path.fillColor = new paper.Color(1, 0, 0, 1);
  path.fillColor = color ? color : new paper.Color(1, 1, 1, 1);
  if (group) {
    group.addChild(path);
  }
  return path;
}

function createCircle(
  centerPoint: paper.Point,
  radius: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  group?: paper.Group,
) {
  const circle = new paper.Path.Circle(centerPoint, radius);
  circle.strokeColor = strokeColor;
  circle.strokeWidth = strokeWidth;
  if (group) {
    group.addChild(circle);
  }
}

const createLine = (
  p0: paper.Point,
  p1: paper.Point,
  strokeColor: paper.Color,
  strokeWidth: number,
  group?: paper.Group,
) => {
  const line = new paper.Path([p0, p1]);
  line.strokeColor = strokeColor;
  line.strokeWidth = strokeWidth;
  if (group) {
    group.addChild(line);
  }
};

function lerp(p1: paper.Point, p2: paper.Point, t: number) {
  return new paper.Point(
    MathUtils.lerp(p1.x, p2.x, t),
    MathUtils.lerp(p1.y, p2.y, t),
  );
}

export function flowerOfLife(
  center: paper.Point,
  radius: number,
  dimensions: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  circlesVisible = false,
  outlineVisible = false,
  linesVisible = false,
  cornersVisible = false,
  gridVisible = false,
) {
  const group = new paper.Group();
  const dotRadius = radius * 0.01;

  if (outlineVisible) {
    const path = new paper.Path.Circle(center, radius);
    path.strokeColor = strokeColor;
    path.strokeWidth = strokeWidth;
    group.addChild(path);
  }

  // Line from center
  let total = 6;
  let innerRadius = radius / dimensions;
  const circleRadius = radius - innerRadius;
  const startAngle = -Math.PI / 6;
  const points: paper.Point[] = [];
  for (let i = 0; i < total; i++) {
    const theta = startAngle + (TWO_PI / total) * i;
    const x = center.x + Math.cos(theta) * circleRadius;
    const y = center.y + Math.sin(theta) * circleRadius;
    points.push(new paper.Point(x, y));
  }

  // draw line between points
  if (linesVisible) {
    const line = new paper.Path([...points, points[0]]);
    line.strokeColor = strokeColor;
    line.strokeWidth = strokeWidth;

    // Front lines of cube
    createLine(points[0], center, strokeColor, strokeWidth, group);
    createLine(center, points[2], strokeColor, strokeWidth, group);
    createLine(center, points[4], strokeColor, strokeWidth, group);

    // Back lines of cube
    createLine(points[5], center, strokeColor, strokeWidth, group);
    createLine(points[1], center, strokeColor, strokeWidth, group);
    createLine(points[3], center, strokeColor, strokeWidth, group);
  }

  const allPoints = [];

  // Draw circles
  for (let z = 0; z < dimensions; z++) {
    for (let y = 0; y < dimensions; y++) {
      for (let x = 0; x < dimensions; x++) {
        // Define the points for the back and front faces
        const backBottomLeft = points[3];
        const backBottomRight = center;
        const backTopLeft = points[4];
        const backTopRight = points[5];

        const frontBottomLeft = points[2];
        const frontBottomRight = points[1];
        const frontTopLeft = center;
        const frontTopRight = points[0];

        const d1 = dimensions - 1;

        // Interpolate between the corners along x, y, and z
        const p0 = lerp(backBottomLeft, backBottomRight, x / d1);
        const p1 = lerp(backTopLeft, backTopRight, x / d1);
        const p2 = lerp(frontBottomLeft, frontBottomRight, x / d1);
        const p3 = lerp(frontTopLeft, frontTopRight, x / d1);

        const px0 = lerp(p0, p1, y / d1);
        const px1 = lerp(p2, p3, y / d1);

        const finalPoint = lerp(px0, px1, z / d1);

        allPoints.push(finalPoint);

        // Optionally, set a color or other properties if needed
        const c = (x / dimensions + y / dimensions + z / dimensions) / 3;
        const color = new paper.Color(c, c, c, 1);

        let circleCol = strokeColor;

        // if (z === 0) {
        //   circleCol = new paper.Color(1, 0, 0, 1);
        // }
        // if (y === 0) {
        //   circleCol = new paper.Color(0, 1, 0, 1);
        // }
        if (x === dimensions) {
          // circleCol = new paper.Color(0, 0, 1, 1);
          // finalPoint.x += 15;
        }

        if (circlesVisible) {
          createCircle(finalPoint, innerRadius, circleCol, strokeWidth, group);
        }

        if (gridVisible) {
          const dot = new paper.Path.Circle(finalPoint, dotRadius);
          dot.fillColor = color;
          group.addChild(dot);
        }
      }
    }
  }

  // filter duplicate points
  if (cornersVisible) {
    dot(points[0], dotRadius, group);
    dot(points[1], dotRadius, group);
    dot(points[2], dotRadius, group);
    dot(points[3], dotRadius, group);
    dot(points[4], dotRadius, group);
    dot(points[5], dotRadius, group);
    dot(center, dotRadius, group);
  }
  return group;
}
