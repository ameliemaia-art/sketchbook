import {
  acanthus,
  Acanthus,
} from "@/stories/blueprints/path-profile/acanthus-geometry";
import paper from "paper";
import {
  ArrowHelper,
  BoxGeometry,
  CatmullRomCurve3,
  Group,
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
import { ExtrudeGeometry } from "@utils/three/extrude-geometry";
import { TWO_PI } from "@utils/three/math";
import { createCanvas } from "@utils/three/modelling";
import { createPoint } from "@utils/three/object3d";
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
};

export function acanthusLeaf(settings: ColumnAcanthus, material: Material) {
  const canvasSize = 10;

  // Physical canvas where points get added to
  const canvas = createCanvas(canvasSize, canvasSize, new Vector3(1, 1, 0));
  // group.add(canvas);

  const points = acanthus(
    new paper.Point(0, 0),
    new paper.Size(10, 10),
    0,
    settings.path,
  );

  points.forEach((point) => {
    canvas.add(createPoint(1, new Vector3(point.x, point.y, 0), true));
  });

  // canvas.translateX(-canvasSize / 2);
  // canvas.rotateY(Math.PI / 2);

  // Create the extrude path from acanthus points with circular ending
  const extrudePath = new CatmullRomCurve3(
    points.map((p) => new Vector3(p.x, p.y, 0)),
  );
  extrudePath.curveType = "catmullrom";
  extrudePath.closed = false; // Acanthus spiral shouldn't be closed

  // Create a simple cross-section shape to extrude along the path
  // This creates a rectangular cross-section for the acanthus leaf
  const crossSectionWidth = 5;
  const crossSectionHeight = 0.5;

  const shape = new Shape();
  shape.moveTo(-crossSectionWidth / 2, -crossSectionHeight / 2);
  shape.lineTo(crossSectionWidth / 2, -crossSectionHeight / 2);
  shape.lineTo(crossSectionWidth / 2, crossSectionHeight / 2);
  shape.lineTo(-crossSectionWidth / 2, crossSectionHeight / 2);
  shape.closePath();

  const extrudeSettings = {
    steps: 50,
    bevelEnabled: false,
    extrudePath: extrudePath,
    taperFunction: createTaperFunction(settings.taperMode, 1, 0.25),
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);
  geometry.rotateX(Math.PI);
  geometry.rotateY(-Math.PI / 2);
  const dimensions = getGeometryDimensions(geometry);
  geometry.translate(0, canvasSize, 0);

  return new Mesh(geometry, settings.wireframe ? wireframeMaterial : material);
}

export function columnAcanthus(settings: ColumnAcanthus, material: Material) {
  const group = new Object3D();

  const leaf = acanthusLeaf(settings, material);
  leaf.add(
    new ArrowHelper(new Vector3(0, 0, 1), new Vector3(0, 0, 0), 5, 0xffff00),
  );
  group.add(leaf);

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
    this.gui
      .addBinding(target, "taperMode", {
        options: {
          Linear: "linear",
          Sine: "sine",
          Quadratic: "quadratic",
          Exponential: "exponential",
          Custom: "custom",
          Circular: "circular",
        },
      })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
