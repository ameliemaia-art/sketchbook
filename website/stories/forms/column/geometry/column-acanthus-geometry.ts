import {
  AcanthusPath,
  acanthusPath,
} from "@/stories/blueprints/path-profile/acanthus-geometry";
import paper from "paper";
import {
  BufferGeometry,
  CatmullRomCurve3,
  LineBasicMaterial,
  LineLoop,
  Material,
  MathUtils,
  Mesh,
  Object3D,
  Shape,
  Vector3,
} from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { pointsToVector3 } from "@utils/paper/utils";
import { CPUFlow } from "@utils/three/cpu-flow";
import { ExtrudeGeometry } from "@utils/three/extrude-geometry";
import { createCanvas } from "@utils/three/modelling";
import { centerGeometry, createPoint } from "@utils/three/object3d";
import { wireframeMaterial } from "../../materials/materials";
import { getGeometryDimensions } from "./column-echinus-geometry";

function createTaperFunction(
  mode: "linear" | "sine",
  start: number = 1,
  end: number = 0.25,
): (t: number) => number {
  switch (mode) {
    case "linear":
      return (t: number) => start + (end - start) * t;
    case "sine":
      // Smooth sine-based easing for organic, leaf-like tapering
      return (t: number) => {
        const eased = Math.sin((1 - t) * Math.PI * 0.5); // Ease out sine curve
        return MathUtils.lerp(end, start, eased);
      };
    default:
      return (t: number) => start + (end - start) * t;
  }
}

export type AcanthusTier = {
  path: AcanthusPath;
  radius: number; // Radius of the circular path
  leafCount: number; // Number of leaves around the circle
  leafTaperMode: "linear" | "sine";
  leafWidth: number;
  leafHeight: number;
  leafSubdivisions: number;
  useBevels: boolean; // Enable/disable bevels (affects extrusion method)
  bevelThickness: number;
  chamferSize: number; // Size of the chamfer
  extrudeDepth: number; // Depth for simple extrusion when not using path
};

export type ColumnAcanthus = {
  helper: boolean;
  wireframe: boolean;
  base: AcanthusTier;
};

export function acanthusLeaf(
  settings: ColumnAcanthus,
  tierSettings: AcanthusTier,
  material: Material,
) {
  const canvasSize = 10;

  // Physical canvas where points get added to
  const canvas = createCanvas(canvasSize, canvasSize, new Vector3(1, 1, 0));

  const points = acanthusPath(
    new paper.Point(0, 0),
    new paper.Size(10, 10),
    0,
    tierSettings.path,
  );

  points.forEach((point) => {
    canvas.add(createPoint(1, new Vector3(point.x, point.y, 0), true));
  });

  // Create the extrude path from acanthus points
  const extrudePath = new CatmullRomCurve3(pointsToVector3(points));
  extrudePath.curveType = "catmullrom";
  extrudePath.closed = false; // Acanthus spiral shouldn't be closed

  const shape = new Shape();

  const chamferSize = tierSettings.chamferSize;

  // Create chamfered rectangle shape
  const halfWidth = tierSettings.leafWidth / 2;
  const halfHeight = tierSettings.leafHeight / 2;

  if (chamferSize > 0) {
    // Create smooth rounded box-style chamfers using quadratic curves
    shape.moveTo(-halfWidth + chamferSize, -halfHeight);

    // Bottom edge with subdivisions
    const stepWidth =
      (tierSettings.leafWidth - 2 * chamferSize) /
      tierSettings.leafSubdivisions;
    for (let i = 1; i <= tierSettings.leafSubdivisions; i++) {
      const x = -halfWidth + chamferSize + i * stepWidth;
      shape.lineTo(x, -halfHeight);
    }

    // Bottom-right rounded corner
    shape.lineTo(halfWidth - chamferSize, -halfHeight);
    shape.quadraticCurveTo(
      halfWidth,
      -halfHeight,
      halfWidth,
      -halfHeight + chamferSize,
    );

    // Right edge
    shape.lineTo(halfWidth, halfHeight - chamferSize);

    // Top-right rounded corner
    shape.quadraticCurveTo(
      halfWidth,
      halfHeight,
      halfWidth - chamferSize,
      halfHeight,
    );

    // Top edge with subdivisions (reverse order)
    for (let i = tierSettings.leafSubdivisions - 1; i >= 0; i--) {
      const x = -halfWidth + chamferSize + i * stepWidth;
      shape.lineTo(x, halfHeight);
    }

    // Top-left rounded corner
    shape.lineTo(-halfWidth + chamferSize, halfHeight);
    shape.quadraticCurveTo(
      -halfWidth,
      halfHeight,
      -halfWidth,
      halfHeight - chamferSize,
    );

    // Left edge
    shape.lineTo(-halfWidth, -halfHeight + chamferSize);

    // Bottom-left rounded corner
    shape.quadraticCurveTo(
      -halfWidth,
      -halfHeight,
      -halfWidth + chamferSize,
      -halfHeight,
    );
  } else {
    // Create subdivided shape along x-axis for better Flow modifier results
    const stepWidth = tierSettings.leafWidth / tierSettings.leafSubdivisions;

    // Start from left bottom
    shape.moveTo(-halfWidth, -halfHeight);

    // Bottom edge with subdivisions
    for (let i = 1; i <= tierSettings.leafSubdivisions; i++) {
      const x = -halfWidth + i * stepWidth;
      shape.lineTo(x, -halfHeight);
    }

    // Right edge
    shape.lineTo(halfWidth, halfHeight);

    // Top edge with subdivisions (reverse order)
    for (let i = tierSettings.leafSubdivisions - 1; i >= 0; i--) {
      const x = -halfWidth + i * stepWidth;
      shape.lineTo(x, halfHeight);
    }
  }

  shape.closePath();

  // Create extrude settings with path extrusion (chamfer is built into the shape)
  const extrudeSettings = {
    steps: 50,
    bevelEnabled: false, // Chamfer is handled by the shape itself
    extrudePath: extrudePath,
    taperFunction: createTaperFunction(tierSettings.leafTaperMode, 1, 0),
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);

  // Apply transformations carefully
  geometry.rotateX(Math.PI);
  geometry.rotateY(Math.PI / 2);
  centerGeometry(geometry);

  return new Mesh(geometry, settings.wireframe ? wireframeMaterial : material);
}

export function columnAcanthus(
  settings: ColumnAcanthus,
  tierSettings: AcanthusTier,
  material: Material,
) {
  const group = new Object3D();

  // Ensure we have valid settings with defaults
  const radius = tierSettings.radius || 10;
  const leafCount = tierSettings.leafCount || 12;

  // Create helper circle
  const circlePoints: Vector3[] = [];
  const numPoints = 64;

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    circlePoints.push(new Vector3(x, 0, z));
  }

  if (settings.helper) {
    const circleGeometry = new BufferGeometry().setFromPoints(circlePoints);
    const circleLine = new LineLoop(
      circleGeometry,
      new LineBasicMaterial({ color: 0x00ff00 }),
    );
    group.add(circleLine);
  }

  // Create multiple leaves positioned around the circle
  for (let i = 0; i < leafCount; i++) {
    // Create a fresh leaf for each instance
    const leaf = acanthusLeaf(settings, tierSettings, material);

    // Calculate position and rotation for this leaf
    const angle = (i / leafCount) * Math.PI * 2;

    // Create a small arc curve for this specific leaf
    // The arc should be roughly the size of the leaf geometry
    const arcPoints: Vector3[] = [];
    const arcLength = tierSettings.leafWidth;
    const arcRadius = radius + arcLength / 2; // Slightly larger radius for the curve
    const arcSpan = arcLength / arcRadius; // Arc angle in radians

    // Create arc points centered around this leaf's angle
    const numArcPoints = 16;
    for (let j = 0; j < numArcPoints; j++) {
      const t = j / (numArcPoints - 1); // 0 to 1
      const arcAngle = angle + (t - 0.5) * arcSpan; // Center arc around leaf angle
      const x = Math.cos(arcAngle) * arcRadius;
      const z = Math.sin(arcAngle) * arcRadius;
      arcPoints.push(new Vector3(x, 0, z));
    }

    const arcCurve = new CatmullRomCurve3(arcPoints);
    arcCurve.closed = false;
    arcCurve.curveType = "catmullrom";

    // Apply CPU Flow to bend the leaf along this arc
    const flow = new CPUFlow(leaf);
    flow.updateCurve(arcCurve);

    group.add(flow.object3D);
  }

  return group;
}

/// #if DEBUG
export class GUIAcanthus extends GUIController {
  constructor(
    gui: GUIType,
    public settings: ColumnAcanthus,
    public tierSettings: AcanthusTier,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Acanthus" });

    this.gui.addBinding(settings, "helper").on("change", this.onChange);
    this.gui.addBinding(settings, "wireframe").on("change", this.onChange);
    this.gui
      .addBinding(tierSettings, "radius", {
        min: 5,
        max: 20,
        step: 0.5,
      })
      .on("change", this.onChange);

    this.gui
      .addBinding(tierSettings, "leafWidth", {
        min: 1,
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(tierSettings, "leafHeight", {
        min: 0.1,
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(tierSettings, "leafCount", {
        min: 3,
        max: 24,
        step: 1,
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(tierSettings, "leafTaperMode", {
        options: {
          Linear: "linear",
          Sine: "sine",
        },
      })
      .on("change", this.onChange);

    this.gui
      .addBinding(tierSettings, "chamferSize", {
        min: 0,
        max: 0.5,
        step: 0.01,
      })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
