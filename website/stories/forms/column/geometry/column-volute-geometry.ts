import {
  AcanthusPath,
  acanthusPath,
} from "@/stories/blueprints/path-profile/acanthus-geometry";
import paper from "paper";
import {
  Box3,
  CatmullRomCurve3,
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
import { ExtrudeGeometry } from "@utils/three/extrude-geometry";
import { TWO_PI } from "@utils/three/math";
import { createCanvas } from "@utils/three/modelling";
import { centerGeometry, createPoint } from "@utils/three/object3d";
import { wireframeMaterial } from "../../materials/materials";
import { getGeometryDimensions } from "./column-echinus-geometry";

function createTaperFunction(
  mode: "linear" | "sine" | "volute",
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
    case "volute":
      // Smooth sine-based easing for organic, leaf-like tapering
      return (t: number) => {
        const min = 0.8;
        const max = 1;
        const x = MathUtils.clamp(
          MathUtils.mapLinear(t, 0, 0.25, max, min),
          min,
          max,
        );

        if (t > 0.5) {
          return MathUtils.clamp(
            MathUtils.mapLinear(t, 0.5, 1, 0.8, 0.5),
            0.3,
            0.8,
          );
        }

        return x;
      };
    default:
      return (t: number) => start + (end - start) * t;
  }
}

export type ColumnVolute = {
  helper: boolean;
  wireframe: boolean;
  path: AcanthusPath;
  width: number;
  height: number;
  subdivisions: number;
  chamferSize: number;
  radius: number;
  positionY: number;
  rotationY: number;
};

export function volute(settings: ColumnVolute, material: Material) {
  const canvasSize = 10;

  // Physical canvas where points get added to
  const canvas = createCanvas(canvasSize, canvasSize, new Vector3(1, 1, 0));

  const points = acanthusPath(
    new paper.Point(0, 0),
    new paper.Size(10, 10),
    0,
    settings.path,
  );

  points.forEach((point) => {
    canvas.add(createPoint(1, new Vector3(point.x, point.y, 0), true));
  });

  // Create the extrude path from acanthus points
  const extrudePath = new CatmullRomCurve3(pointsToVector3(points));
  extrudePath.curveType = "catmullrom";
  extrudePath.closed = false; // Acanthus spiral shouldn't be closed

  const shape = new Shape();

  const chamferSize = settings.chamferSize;

  // Create chamfered rectangle shape
  const halfWidth = settings.width / 2;
  const halfHeight = settings.height / 2;

  if (chamferSize > 0) {
    // Create smooth rounded box-style chamfers using quadratic curves
    shape.moveTo(-halfWidth + chamferSize, -halfHeight);

    // Bottom edge with subdivisions
    const stepWidth =
      (settings.width - 2 * chamferSize) / settings.subdivisions;
    for (let i = 1; i <= settings.subdivisions; i++) {
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
    for (let i = settings.subdivisions - 1; i >= 0; i--) {
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
    const stepWidth = settings.width / settings.subdivisions;

    // Start from left bottom
    shape.moveTo(-halfWidth, -halfHeight);

    // Bottom edge with subdivisions
    for (let i = 1; i <= settings.subdivisions; i++) {
      const x = -halfWidth + i * stepWidth;
      shape.lineTo(x, -halfHeight);
    }

    // Right edge
    shape.lineTo(halfWidth, halfHeight);

    // Top edge with subdivisions (reverse order)
    for (let i = settings.subdivisions - 1; i >= 0; i--) {
      const x = -halfWidth + i * stepWidth;
      shape.lineTo(x, halfHeight);
    }
  }

  shape.closePath();

  // Create extrude settings with path extrusion (chamfer is built into the shape)
  const extrudeSettings = {
    steps: 100,
    bevelEnabled: false, // Chamfer is handled by the shape itself
    extrudePath: extrudePath,
    taperFunction: createTaperFunction("volute", 1, 0.3),
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);

  // Apply transformations carefully
  geometry.rotateX(Math.PI);
  geometry.rotateY(Math.PI / 2);
  centerGeometry(geometry);

  geometry.computeVertexNormals();

  const dimemsions = getGeometryDimensions(geometry);
  geometry.translate(0, dimemsions.height / 2 + settings.positionY, 0);

  return new Mesh(geometry, settings.wireframe ? wireframeMaterial : material);
}

export function columnVolute(settings: ColumnVolute, material: Material) {
  const group = new Object3D();

  const length = 4;
  for (let i = 0; i < length; i++) {
    const mesh = volute(settings, material);
    const theta = (i / length) * TWO_PI;
    const x = Math.cos(theta) * settings.radius;
    const y = 0;
    const z = Math.sin(theta) * settings.radius;
    mesh.position.set(x, y, z);
    mesh.rotation.y = -Math.PI + (-theta + Math.PI / 2);
    group.add(mesh);
  }

  group.rotation.y = MathUtils.degToRad(settings.rotationY);

  return group;
}

/// #if DEBUG
export class GUIVolute extends GUIController {
  constructor(
    gui: GUIType,
    public settings: ColumnVolute,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Volute" });

    this.gui.addBinding(settings, "helper").on("change", this.onChange);
    this.gui.addBinding(settings, "wireframe").on("change", this.onChange);

    this.gui
      .addBinding(settings, "width", {
        min: 1,
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(settings, "height", {
        min: 0.1,
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(settings, "chamferSize", {
        min: 0,
        max: 0.5,
        step: 0.01,
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(settings, "positionY", {
        min: 0,
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(settings, "rotationY", {
        min: 0,
        max: 360,
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(settings, "radius", {
        min: 0,
        max: 360,
      })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
