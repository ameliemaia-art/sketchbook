import paper from "paper";

import { TWO_PI } from "@utils/three/math";
import { createCircle, createLine, dot, lerp } from "../utils";

function createFlowerCircle(
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

    // Edge petals
    const p0 = points[i];
    const p1 = points[i === total - 1 ? 0 : i + 1];
    const middle = lerp(p0, p1, 0.5);
    const sidePetal = petal.clone();
    sidePetal.position = middle;
    sidePetal.rotate(angle * i, middle);
    group.addChild(centerPetal);
    group.addChild(sidePetal);
  }
  petal.remove();
  return group;
}

export function flowerOfLife(
  center: paper.Point,
  radius: number,
  dimensions: number,
  strokeColor: paper.Color,
  strokeWidth: number,
  circlesVisible = false,
  petals = false,
  outlineVisible = false,
  linesVisible = false,
  cornersVisible = false,
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

  if (circlesVisible) {
    createCircle(center, innerRadius, strokeColor, strokeWidth, group);
  }

  const startAngle = -Math.PI / 6;

  const flowerCircle = createFlowerCircle(
    center,
    innerRadius,
    startAngle,
    strokeColor,
    strokeWidth,
  );

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
        if (circlesVisible) {
          if (petals) {
            const petal = flowerCircle.clone();
            petal.position = p;
            group.addChild(petal);
          } else {
            createCircle(p, innerRadius, strokeColor, strokeWidth, group);
          }
        }
      }
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

    // Draw dots at corners of cube
    if (cornersVisible) {
      dot(points[0], dotRadius, group);
      dot(points[1], dotRadius, group);
      dot(points[2], dotRadius, group);
      dot(points[3], dotRadius, group);
      dot(points[4], dotRadius, group);
      dot(points[5], dotRadius, group);
      // dot(center, dotRadius, group);
    }
  }

  flowerCircle.remove();

  return group;
}
