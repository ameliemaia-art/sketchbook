import {
  Box3,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Material,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  Shape,
  Vector2,
  Vector3,
} from "three";

export function extrude(
  shape: Shape,
  params = { depth: 0.1, bevelEnabled: false },
) {
  const geometry = new ExtrudeGeometry(shape, params);
  return geometry;
}

/**
 * Subdivides a 2D shape outline by adding intermediate points along horizontal lines (Y-axis divisions)
 * This is useful for creating more control points before extrusion to enable path deformation
 * @param points - Array of Vector2 points defining the shape outline
 * @param yDivisions - Number of horizontal divisions to add
 * @returns Array of Vector2 points with subdivisions added
 */
export function subdivideShapeOutline(
  points: Vector2[],
  yDivisions: number,
): Vector2[] {
  if (yDivisions <= 0 || points.length < 3) return points;

  // Find the bounding box of the shape
  let minY = Infinity;
  let maxY = -Infinity;

  points.forEach((point) => {
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });

  const height = maxY - minY;
  const subdivisions: Vector2[] = [];

  // Create horizontal lines at subdivision levels
  for (let i = 0; i <= yDivisions; i++) {
    const y = minY + (i / yDivisions) * height;

    // Find intersections with the shape outline at this Y level
    const intersections: { x: number; index: number }[] = [];

    for (let j = 0; j < points.length; j++) {
      const p1 = points[j];
      const p2 = points[(j + 1) % points.length];

      // Check if horizontal line intersects this edge
      const minEdgeY = Math.min(p1.y, p2.y);
      const maxEdgeY = Math.max(p1.y, p2.y);

      if (y >= minEdgeY && y <= maxEdgeY && Math.abs(p1.y - p2.y) > 0.001) {
        // Calculate intersection point
        const t = (y - p1.y) / (p2.y - p1.y);
        const x = p1.x + t * (p2.x - p1.x);
        intersections.push({ x, index: j });
      }
    }

    // Sort intersections by X coordinate
    intersections.sort((a, b) => a.x - b.x);

    // Add intersection points
    intersections.forEach((intersection) => {
      subdivisions.push(new Vector2(intersection.x, y));
    });
  }

  // Combine original points with subdivision points and sort by angle from centroid
  const allPoints = [...points, ...subdivisions];

  // Calculate centroid
  const centroid = new Vector2(0, 0);
  allPoints.forEach((point) => centroid.add(point));
  centroid.divideScalar(allPoints.length);

  // Sort points by angle from centroid to maintain proper winding order
  allPoints.sort((a, b) => {
    const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
    const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
    return angleA - angleB;
  });

  return allPoints;
}

/**
 * Alternative approach: Subdivide shape by interpolating between adjacent points
 * This maintains the original shape outline better but may not provide ideal Y-axis divisions
 * @param points - Array of Vector2 points defining the shape outline
 * @param subdivisions - Number of subdivisions to add between each pair of points
 * @returns Array of Vector2 points with subdivisions added
 */
export function subdivideShapeByEdges(
  points: Vector2[],
  subdivisions: number,
): Vector2[] {
  if (subdivisions <= 0 || points.length < 3) return points;

  const result: Vector2[] = [];

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];

    result.push(current.clone());

    // Add subdivision points between current and next
    for (let j = 1; j <= subdivisions; j++) {
      const t = j / (subdivisions + 1);
      const interpolated = new Vector2(
        current.x + t * (next.x - current.x),
        current.y + t * (next.y - current.y),
      );
      result.push(interpolated);
    }
  }

  return result;
}

/**
 * Enhanced extrude function with vertical subdivisions
 * @param shape - The 2D shape to extrude
 * @param params - Extrude parameters including depth and bevel settings
 * @param heightDivisions - Number of divisions along the height (Z-axis)
 * @returns ExtrudeGeometry with additional height subdivisions
 */
export function extrudeWithSubdivisions(
  shape: Shape,
  params = { depth: 0.1, bevelEnabled: false },
  heightDivisions: number = 0,
): ExtrudeGeometry {
  // Use Three.js built-in steps parameter for cleaner subdivision
  const extrudeParams = {
    ...params,
    steps: Math.max(1, heightDivisions), // steps parameter controls vertical subdivisions
  };

  const geometry = new ExtrudeGeometry(shape, extrudeParams);
  return geometry;
}

/**
 * Creates a plane geometry with specified dimensions, segments, and pivot point
 * @param width - Width dimension (X-axis)
 * @param height - Height dimension (Y-axis)
 * @param widthSegments - Number of segments along width (default: 1)
 * @param heightSegments - Number of segments along height (default: 1)
 * @param pivot - Pivot point as a normalized vector (-1 to 1 for X and Y)
 *                Default is (0, 0, 0) for center pivot
 *                (-1, -1, 0) = bottom-left corner
 *                (1, 1, 0) = top-right corner
 * @returns PlaneGeometry positioned according to the pivot point
 */
const canvasMaterial = new MeshBasicMaterial({
  wireframe: true,
  color: 0xff0000,
});
export function createCanvas(
  width: number,
  height: number,
  pivot: Vector3 = new Vector3(0, 0, 0), // Normalized
) {
  const geometry = new PlaneGeometry(width, height, 1, 1);

  // Calculate offset based on pivot point
  // Pivot ranges from -1 to 1, so we need to convert to actual offset
  const offsetX = (pivot.x * width) / 2;
  const offsetY = (pivot.y * height) / 2;

  // Translate geometry to position pivot point at origin
  geometry.translate(offsetX, offsetY, 0);

  const mesh = new Mesh(geometry, canvasMaterial);

  // Orientate so the coordinates match paperjs canvas (top left)
  mesh.rotateX(-Math.PI);
  mesh.translateY(-height);
  return mesh;
}

export function getCanvasPoints(canvas: Mesh<PlaneGeometry, Material>) {
  const points: Vector2[] = [];
  canvas.children.forEach((child) => {
    const worldPosition = new Vector3();
    child.localToWorld(worldPosition);
    points.push(new Vector2(worldPosition.x, worldPosition.y));
  });
  return points;
}

export type Spline = {
  curve: CatmullRomCurve3;
  points: Array<Vector3>;
};

export function createSmoothSpline(
  positions: Vector3[],
  totalPoints: number = 10,
): Spline {
  let curve = new CatmullRomCurve3(positions);
  const points = curve.getPoints(totalPoints);
  curve = new CatmullRomCurve3(points);
  return {
    curve,
    points,
  };
}
