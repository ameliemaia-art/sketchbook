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
  array?: paper.Path.Line[],
) => {
  const line = new paper.Path(points);
  line.strokeColor = strokeColor;
  line.strokeWidth = strokeWidth;
  if (group) {
    group.addChild(line);
  }
  if (array instanceof Array) {
    array.push(line);
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
  fontSize = 15,
  fontColor = new paper.Color(1, 1, 1, 1),
) {
  points.forEach((point, i) => {
    createCircle(point, radius, color, strokeWidth);

    if (showText) {
      // Draw text next to point
      const text = new paper.PointText(point);
      text.content = `${i}`;
      text.style.fontSize = fontSize;
      text.fillColor = fontColor;
      text.position = new paper.Point(point.x, point.y);
    }
  });
}

export function filterIntersectionPositions(
  points: paper.Point[],
  tolerance = 0.0001,
): paper.Point[] {
  const seen = new Set<string>();
  return points.filter((point) => {
    // Round coordinates to the specified tolerance
    const key = `${Math.round(point.x / tolerance) * tolerance},${Math.round(point.y / tolerance) * tolerance}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
