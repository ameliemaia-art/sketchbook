import paper from "paper";
import { MathUtils } from "three";

export function dot(
  position: paper.Point,
  radius: number,
  group?: paper.Group,
  color?: paper.Color,
) {
  const path = new paper.Path.Circle(position, radius);
  path.fillColor = color ? color : new paper.Color(1, 1, 1, 1);
  if (group) {
    group.addChild(path);
  }
  return path;
}

export function createCircle(
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
  return circle;
}

export const createLine = (
  points: paper.Point[],
  strokeColor: paper.Color,
  strokeWidth: number,
  group?: paper.Group,
) => {
  const line = new paper.Path(points);
  line.strokeColor = strokeColor;
  line.strokeWidth = strokeWidth;
  if (group) {
    group.addChild(line);
  }
  return line;
};

export function lerp(p1: paper.Point, p2: paper.Point, t: number) {
  return new paper.Point(
    MathUtils.lerp(p1.x, p2.x, t),
    MathUtils.lerp(p1.y, p2.y, t),
  );
}

export function debugPoints(
  points: paper.Point[],
  color: paper.Color,
  strokeWidth = 1,
  radius = 5,
  showText = false,
) {
  points.forEach((point, i) => {
    createCircle(point, radius, color, strokeWidth);

    if (showText) {
      // Draw text next to point
      const text = new paper.PointText(point);
      text.content = `${i}`;
      text.style.fontSize = 15;
      text.fillColor = new paper.Color(1, 0, 0, 1);
      text.position = new paper.Point(point.x, point.y);
    }
  });
}
