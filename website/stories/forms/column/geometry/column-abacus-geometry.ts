import { abacusPath } from "@/stories/blueprints/path-profile/abacus-geometry";
import paper from "paper";
import {
  BoxGeometry,
  CatmullRomCurve3,
  Material,
  MathUtils,
  Matrix4,
  Mesh,
  Object3D,
  Shape,
  ShapePath,
  Vector3,
} from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { pointsToVector3 } from "@utils/paper/utils";
import { ExtrudeGeometry } from "@utils/three/extrude-geometry";
import { createCanvas } from "@utils/three/modelling";
import { centerGeometry, createPoint } from "@utils/three/object3d";
import { wireframeMaterial } from "../../materials/materials";
import { getGeometryDimensions } from "./column-echinus-geometry";

export type ColumnAbacus = {
  radius: number;
  height: number;
  cornerAngleOffset: number;
  taperEnabled: boolean;
  taperAmount: number;
  bevelEnabled: boolean;
  bevelThickness: number;
  bevelSize: number;
  bevelSegments: number;
  helper: boolean;
  wireframe: boolean;
};

function createTaperFunction(
  mode: "linear" | "sine",
  start: number = 1,
  end: number = 0.25,
  angle: number = 90,
): (t: number) => number {
  switch (mode) {
    case "linear":
      return (t: number) => start + (end - start) * t;
    case "sine":
      // Smooth sine-based easing for organic, leaf-like tapering that curves inward
      return (t: number) => {
        const eased = Math.sin(t * MathUtils.degToRad(angle)); // Ease in sine curve (curves inward)
        return MathUtils.lerp(start, end, eased);
      };
    default:
      return (t: number) => start + (end - start) * t;
  }
}

export function columnAbacus(settings: ColumnAbacus, material: Material) {
  // const group = new Object3D();

  const canvas = createCanvas(
    settings.radius,
    settings.radius,
    new Vector3(1, 1, 0),
  );
  const points = abacusPath(
    new paper.Point(settings.radius / 2, settings.radius / 2),
    new paper.Size(settings.radius, settings.radius),
    1,
    {
      radius: 0.5,
      cornerAngleOffset: settings.cornerAngleOffset,
      subdivisions: 20,
    },
  );

  points.forEach((point) => {
    canvas.add(createPoint(1, new Vector3(point.x, point.y, 0), true));
  });

  const shape = new Shape();

  // Center the shape by calculating the centroid and offsetting points
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  shape.moveTo(points[0].x - centerX, points[0].y - centerY);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i].x - centerX, points[i].y - centerY);
  }
  shape.closePath();

  const extrudePath = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(0, 0, settings.height),
  ]);

  // Create extrude settings with proper bevel configuration
  // Note: When bevelEnabled is true, use depth instead of extrudePath
  const extrudeSettings = settings.bevelEnabled
    ? {
        steps: 10,
        depth: settings.height,
        bevelEnabled: true,
        bevelThickness: settings.bevelThickness,
        bevelSize: settings.bevelSize,
        bevelOffset: 0,
        bevelSegments: settings.bevelSegments,
      }
    : {
        steps: 10,
        bevelEnabled: false,
        extrudePath: extrudePath,
        taperFunction: createTaperFunction("sine", 1, 1 - settings.taperAmount),
      };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);

  // Apply transformations in the correct order
  // First rotate to orient properly (X-axis becomes vertical)
  geometry.rotateX(Math.PI / 2);

  // Then position the bottom at y=0
  const dimensions = getGeometryDimensions(geometry);
  geometry.translate(0, -dimensions.boundingBox.min.y, 0);

  const mesh = new Mesh(
    geometry,
    settings.wireframe ? wireframeMaterial : material,
  );

  // group.add(canvas);
  // group.add(mesh);

  return mesh;
}

/// #if DEBUG
export class GUIAbacus extends GUIController {
  constructor(
    gui: GUIType,
    public target: ColumnAbacus,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Abacus" });

    this.gui
      .addBinding(target, "radius", { min: 1 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "height", { min: 1 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "cornerAngleOffset", { min: 0.1 })
      .on("change", this.onChange);

    this.gui.addBinding(target, "taperEnabled").on("change", this.onChange);
    this.gui
      .addBinding(target, "taperAmount", { min: 0, max: 0.5 })
      .on("change", this.onChange);

    this.gui.addBinding(target, "bevelEnabled").on("change", this.onChange);
    this.gui
      .addBinding(target, "bevelThickness", { min: 0, max: 5 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "bevelSize", { min: 0, max: 10 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "bevelSegments", { min: 1, max: 20, step: 1 })
      .on("change", this.onChange);
    this.gui.addBinding(target, "helper").on("change", this.onChange);
    this.gui.addBinding(target, "wireframe").on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
