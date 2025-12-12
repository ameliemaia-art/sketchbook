import paper from "paper";
import { MathUtils, Vector3 } from "three";

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
  strokeColor?: paper.Color,
  strokeWidth?: number,
  fillColor?: paper.Color,
  group?: paper.Group,
) {
  const circle = new paper.Path.Circle(centerPoint, radius);
  if (fillColor) {
    circle.fillColor = fillColor;
  }
  if (strokeColor) {
    circle.strokeColor = strokeColor;
  }
  if (strokeWidth) {
    circle.strokeWidth = strokeWidth;
  }
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
  const group = new paper.Group();
  points.forEach((point, i) => {
    group.addChild(createCircle(point, radius, color, strokeWidth));

    if (showText) {
      // Draw text next to point
      const text = new paper.PointText(point);
      text.content = `${i}`;
      text.style.fontSize = fontSize;
      text.fillColor = fontColor;
      text.position = new paper.Point(point.x, point.y);
      group.addChild(text);
    }
  });
  return group;
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

export function createGrid(
  center: paper.Point,
  size: paper.Size,
  strokeColor: paper.Color,
  strokeWidth: number,
  divisions: number,
  group: paper.Group,
  border = true,
) {
  const step = size.width / divisions; // Keep the original step size
  const halfSize = size.width / 2;
  const threshold = strokeWidth; // Distance from the border edge

  // Create the grid lines
  for (let i = 1; i < divisions; i++) {
    const x = -halfSize + i * step;
    const y = -halfSize + i * step;

    // Create vertical line
    const vertical = new paper.Path.Line(
      new paper.Point(center.x + x, center.y - halfSize + threshold),
      new paper.Point(center.x + x, center.y + halfSize - threshold),
    );
    vertical.strokeWidth = strokeWidth;
    vertical.strokeColor = strokeColor;
    group.addChild(vertical);

    // Create horizontal line
    const horizontal = new paper.Path.Line(
      new paper.Point(center.x - halfSize + threshold, center.y + y),
      new paper.Point(center.x + halfSize - threshold, center.y + y),
    );
    horizontal.strokeWidth = strokeWidth;
    horizontal.strokeColor = strokeColor;
    group.addChild(horizontal);
  }

  // Create a rectangle for the border
  if (border) {
    const outline = new paper.Path.Rectangle(
      new paper.Point(
        center.x - halfSize + strokeWidth / 2,
        center.y - halfSize + strokeWidth / 2,
      ),
      new paper.Point(
        center.x + halfSize - strokeWidth / 2,
        center.y + halfSize - strokeWidth / 2,
      ),
    );
    outline.strokeWidth = strokeWidth;
    outline.strokeColor = strokeColor;
    outline.strokeCap = "square";
    outline.strokeJoin = "miter"; // Ensure clean corners
    group.addChild(outline);
  }

  return group;
}

export function createPointOnCircle(
  center: paper.Point,
  radius: number,
  angle: number,
) {
  return new paper.Point(
    center.x + radius * Math.cos(angle),
    center.y + radius * Math.sin(angle),
  );
}

export function pointsToVector3(points: paper.Point[]): Vector3[] {
  return points.map((p) => new Vector3(p.x, p.y, 0));
}

export function vector3ToPoints(vectors: Vector3[]): paper.Point[] {
  return vectors.map((v) => new paper.Point(v.x, v.y));
}
