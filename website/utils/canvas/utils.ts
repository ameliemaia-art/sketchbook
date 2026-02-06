import { MathUtils, Vector3 } from "three";

/** Simple 2D point interface for canvas operations */
export interface Point {
  x: number;
  y: number;
}

/** Size interface for canvas dimensions */
export interface Size {
  width: number;
  height: number;
}

/** Convert normalized color (0-1) or RGBA to CSS color string */
function toColorString(color: string | number[]): string {
  if (typeof color === "string") return color;
  if (color.length === 3) {
    return `rgb(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)})`;
  }
  return `rgba(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)}, ${color[3]})`;
}

export function dot(
  ctx: CanvasRenderingContext2D,
  position: Point,
  radius: number,
  color: string | number[] = [1, 1, 1, 1],
) {
  ctx.fillStyle = toColorString(color);
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function createCircle(
  ctx: CanvasRenderingContext2D,
  centerPoint: Point,
  radius: number,
  strokeColor?: string | number[],
  strokeWidth?: number,
  fillColor?: string | number[],
) {
  ctx.beginPath();
  ctx.arc(centerPoint.x, centerPoint.y, radius, 0, Math.PI * 2);

  if (fillColor) {
    ctx.fillStyle = toColorString(fillColor);
    ctx.fill();
  }

  if (strokeColor && strokeWidth) {
    ctx.strokeStyle = toColorString(strokeColor);
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

export const createLine = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  strokeColor: string | number[],
  strokeWidth: number,
) => {
  if (points.length < 2) return;

  ctx.strokeStyle = toColorString(strokeColor);
  ctx.lineWidth = strokeWidth;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.stroke();
};

export function lerp(p1: Point, p2: Point, t: number): Point {
  return {
    x: MathUtils.lerp(p1.x, p2.x, t),
    y: MathUtils.lerp(p1.y, p2.y, t),
  };
}

export function debugPoints(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  color: string | number[],
  strokeWidth = 1,
  radius = 5,
  showText = false,
  fontSize = 15,
  fontColor: string | number[] = [1, 1, 1, 1],
) {
  points.forEach((point, i) => {
    createCircle(ctx, point, radius, color, strokeWidth);

    if (showText) {
      ctx.fillStyle = toColorString(fontColor);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${i}`, point.x, point.y);
    }
  });
}

export function filterIntersectionPositions(
  points: Point[],
  tolerance = 0.0001,
): Point[] {
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
  ctx: CanvasRenderingContext2D,
  center: Point,
  size: Size,
  strokeColor: string | number[],
  strokeWidth: number,
  divisionsX: number,
  divisionsY: number,
  border = true,
) {
  const stepX = size.width / divisionsX;
  const stepY = size.height / divisionsY;
  const halfWidth = size.width / 2;
  const halfHeight = size.height / 2;
  const threshold = strokeWidth;

  ctx.strokeStyle = toColorString(strokeColor);
  ctx.lineWidth = strokeWidth;

  // Create vertical grid lines
  for (let i = 1; i < divisionsX; i++) {
    const x = -halfWidth + i * stepX;
    ctx.beginPath();
    ctx.moveTo(center.x + x, center.y - halfHeight + threshold);
    ctx.lineTo(center.x + x, center.y + halfHeight - threshold);
    ctx.stroke();
  }

  // Create horizontal grid lines
  for (let i = 1; i < divisionsY; i++) {
    const y = -halfHeight + i * stepY;
    ctx.beginPath();
    ctx.moveTo(center.x - halfWidth + threshold, center.y + y);
    ctx.lineTo(center.x + halfWidth - threshold, center.y + y);
    ctx.stroke();
  }

  // Create a rectangle for the border
  if (border) {
    ctx.lineCap = "square";
    ctx.lineJoin = "miter";
    ctx.strokeRect(
      center.x - halfWidth + strokeWidth / 2,
      center.y - halfHeight + strokeWidth / 2,
      size.width - strokeWidth,
      size.height - strokeWidth,
    );
  }
}

export function createPointOnCircle(
  center: Point,
  radius: number,
  angle: number,
): Point {
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
  };
}

export function pointsToVector3(points: Point[]): Vector3[] {
  return points.map((p) => new Vector3(p.x, p.y, 0));
}

export function vector3ToPoints(vectors: Vector3[]): Point[] {
  return vectors.map((v) => ({ x: v.x, y: v.y }));
}
