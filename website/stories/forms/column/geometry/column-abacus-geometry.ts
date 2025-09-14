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
  shape.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i].x, points[i].y);
  }
  shape.closePath();

  const extrudePath = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(0, 0, settings.height),
  ]);

  // Create extrude settings with proper bevel configuration
  // Note: When bevelEnabled is true, avoid using extrudePath as they can conflict
  const extrudeSettings = settings.bevelEnabled
    ? {
        steps: 10,
        depth: settings.height,
        bevelEnabled: settings.bevelEnabled,
        bevelThickness: settings.bevelThickness,
        bevelSize: settings.bevelSize,
        bevelOffset: 0,
        bevelSegments: settings.bevelSegments,
      }
    : {
        steps: 10,
        bevelEnabled: false,
        extrudePath: extrudePath,
        taperFunction: createTaperFunction("linear", 1, 0.1),
      };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);
  // Apply transformations carefully
  centerGeometry(geometry);
  geometry.rotateX(Math.PI / 2);

  const dimensions = getGeometryDimensions(geometry);
  geometry.translate(0, dimensions.height / 2, 0);

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
