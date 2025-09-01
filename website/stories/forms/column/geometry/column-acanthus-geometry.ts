import {
  acanthus,
  Acanthus,
} from "@/stories/blueprints/path-profile/acanthus-geometry";
import paper from "paper";
import {
  ArrowHelper,
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Group,
  LineBasicMaterial,
  LineLoop,
  Material,
  MathUtils,
  Matrix4,
  Mesh,
  Object3D,
  Shape,
  Vector2,
  Vector3,
} from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { pointsToVector3 } from "@utils/paper/utils";
import { Flow } from "@utils/three/curve-modifier";
import { ExtrudeGeometry } from "@utils/three/extrude-geometry";
import { TWO_PI } from "@utils/three/math";
import { createCanvas } from "@utils/three/modelling";
import { centerGeometry, createPoint } from "@utils/three/object3d";
import { wireframeMaterial } from "../../materials/materials";
import { getGeometryDimensions } from "./column-echinus-geometry";

function createTaperFunction(
  mode: "linear" | "sine",
  start: number = 1,
  end: number = 0.25,
  circularSettings?: { enabled: boolean; radius: number; steps: number },
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

export type ColumnAcanthus = {
  helper: boolean;
  wireframe: boolean;
  path: Acanthus;
  taperMode: "linear" | "sine";
  radius: number; // Radius of the circular path
  leafCount: number; // Number of leaves around the circle
};

export function acanthusLeaf(settings: ColumnAcanthus, material: Material) {
  const canvasSize = 10;

  // Physical canvas where points get added to
  const canvas = createCanvas(canvasSize, canvasSize, new Vector3(1, 1, 0));

  const points = acanthus(
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

  // Create a simple rectangular cross-section shape to extrude along the path
  // Adding subdivisions for better Flow deformation
  const crossSectionWidth = 5;
  const crossSectionHeight = 0.5;
  const subdivisions = 12; // More subdivisions for better curve deformation

  const shape = new Shape();

  // Create subdivided shape along x-axis for better Flow modifier results
  const stepWidth = crossSectionWidth / subdivisions;

  // Start from left bottom
  shape.moveTo(-crossSectionWidth / 2, -crossSectionHeight / 2);

  // Bottom edge with subdivisions
  for (let i = 1; i <= subdivisions; i++) {
    const x = -crossSectionWidth / 2 + i * stepWidth;
    shape.lineTo(x, -crossSectionHeight / 2);
  }

  // Right edge
  shape.lineTo(crossSectionWidth / 2, crossSectionHeight / 2);

  // Top edge with subdivisions (reverse order)
  for (let i = subdivisions - 1; i >= 0; i--) {
    const x = -crossSectionWidth / 2 + i * stepWidth;
    shape.lineTo(x, crossSectionHeight / 2);
  }

  shape.closePath();

  const extrudeSettings = {
    steps: 50,
    bevelEnabled: false,
    extrudePath: extrudePath,
    taperFunction: createTaperFunction(settings.taperMode, 1, 0.1),
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);
  // geometry.rotateX(Math.PI);
  geometry.rotateY(-Math.PI / 2);
  centerGeometry(geometry);
  return new Mesh(geometry, settings.wireframe ? wireframeMaterial : material);
}

export function columnAcanthus(settings: ColumnAcanthus, material: Material) {
  const group = new Object3D();

  // Ensure we have valid settings with defaults
  const radius = settings.radius || 10;
  const leafCount = settings.leafCount || 12;

  // Create a single acanthus leaf to use as the base
  const baseLeaf = acanthusLeaf(settings, material);

  // Create a circular path for the Flow modifier
  const circlePoints: Vector3[] = [];
  const numPoints = 64; // More points for smoother curve

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    circlePoints.push(new Vector3(x, 0, z));
  }

  const circleCurve = new CatmullRomCurve3(circlePoints);
  circleCurve.closed = true;
  circleCurve.curveType = "catmullrom";

  // Create multiple flow instances for each leaf position
  for (let i = 0; i < leafCount; i++) {
    const flow = new Flow(baseLeaf);
    flow.updateCurve(0, circleCurve);

    // Set the path offset to position this leaf at the correct point on the circle
    const t = i / leafCount;
    flow.uniforms.pathOffset.value = t;

    group.add(flow.object3D);
  }

  // Add helper to show the circular path
  // if (settings.helper) {
  //   const circleGeometry = new BufferGeometry().setFromPoints(circlePoints);
  //   const circleLine = new LineLoop(
  //     circleGeometry,
  //     new LineBasicMaterial({ color: 0x00ff00 }),
  //   );
  //   group.add(circleLine);
  // }

  return group;
}

/// #if DEBUG
export class GUIAcanthus extends GUIController {
  constructor(
    gui: GUIType,
    public target: ColumnAcanthus,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Acanthus" });

    this.gui.addBinding(target, "helper").on("change", this.onChange);
    this.gui.addBinding(target, "wireframe").on("change", this.onChange);
    // this.gui
    //   .addBinding(target, "radius", {
    //     min: 5,
    //     max: 20,
    //     step: 0.5,
    //   })
    //   .on("change", this.onChange);
    // this.gui
    //   .addBinding(target, "leafCount", {
    //     min: 3,
    //     max: 24,
    //     step: 1,
    //   })
    //   .on("change", this.onChange);
    this.gui
      .addBinding(target, "taperMode", {
        options: {
          Linear: "linear",
          Sine: "sine",
        },
      })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
