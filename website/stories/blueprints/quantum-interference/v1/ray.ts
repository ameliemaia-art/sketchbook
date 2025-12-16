import { Vector2 } from "three";

export default class Ray {
  constructor(
    public origin: Vector2,
    public direction: Vector2,
    public size: Vector2,
  ) {}

  intersectRayWithBounds(origin: Vector2, direction: Vector2): Vector2 {
    const result = new Vector2();
    const farPoint = new Vector2(
      origin.x + this.size.x * 2 * direction.x,
      origin.y + this.size.y * 2 * direction.y,
    );

    // Check intersection with each edge of the bounding box
    let minT = Infinity;

    // Normalize direction for consistent math
    const dir = direction.clone().normalize();

    // Check all four edges
    const edges = [
      { start: new Vector2(0, 0), end: new Vector2(this.size.x, 0) }, // top
      {
        start: new Vector2(this.size.x, 0),
        end: new Vector2(this.size.x, this.size.y),
      }, // right
      {
        start: new Vector2(this.size.x, this.size.y),
        end: new Vector2(0, this.size.y),
      }, // bottom
      { start: new Vector2(0, this.size.y), end: new Vector2(0, 0) }, // left
    ];

    for (const edge of edges) {
      const t = this.rayLineSegmentIntersection(
        origin,
        dir,
        edge.start,
        edge.end,
      );
      if (t !== null && t > 0 && t < minT) {
        minT = t;
      }
    }

    if (minT !== Infinity) {
      result.set(origin.x + minT * dir.x, origin.y + minT * dir.y);
    } else {
      result.copy(farPoint);
    }

    return result;
  }

  /**
   * Ray-line segment intersection using parametric form.
   * Returns t value along ray direction, or null if no intersection.
   */
  rayLineSegmentIntersection(
    rayOrigin: Vector2,
    rayDir: Vector2,
    segStart: Vector2,
    segEnd: Vector2,
  ): number | null {
    const v1 = rayOrigin.clone().sub(segStart);
    const v2 = segEnd.clone().sub(segStart);
    const v3 = new Vector2(-rayDir.y, rayDir.x);

    const dot = v2.dot(v3);
    if (Math.abs(dot) < 0.000001) return null;

    const t1 = (v2.x * v1.y - v2.y * v1.x) / dot;
    const t2 = v1.dot(v3) / dot;

    if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
      return t1;
    }

    return null;
  }
}
