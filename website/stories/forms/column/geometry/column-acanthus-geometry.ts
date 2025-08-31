import {
  Acanthus,
  acanthus,
} from "@/stories/blueprints/path-profile/acanthus-geometry";
import paper from "paper";
import {
  BoxGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Group,
  Material,
  Matrix4,
  Mesh,
  Object3D,
  Shape,
  Vector2,
  Vector3,
} from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import {
  createCanvas,
  extrude,
  extrudeWithSubdivisions,
  getCanvasPoints,
  subdivideShapeByEdges,
  subdivideShapeOutline,
} from "@utils/three/modelling";
import { createPoint } from "@utils/three/object3d";
import { wireframeMaterial } from "../../materials/materials";
import { getGeometryDimensions } from "./column-echinus-geometry";

export type ColumnAcanthus = {
  helper: boolean;
  wireframe: boolean;
  path: Acanthus;
};

export function columnAcanthus(settings: ColumnAcanthus, material: Material) {
  const group = new Object3D();

  const canvasSize = 10;

  // Physical canvas where points get added to
  const canvas = createCanvas(canvasSize, canvasSize, new Vector3(1, 1, 0));
  group.add(canvas);

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

  // Create the extrude path from acanthus points
  const extrudePath = new CatmullRomCurve3(points);
  extrudePath.curveType = "catmullrom";
  extrudePath.closed = false; // Acanthus spiral shouldn't be closed

  // Create a simple cross-section shape to extrude along the path
  // This creates a rectangular cross-section for the acanthus leaf
  const crossSectionWidth = 5;
  const crossSectionHeight = 0.1;

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
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);

  const mesh = new Mesh(
    geometry,
    settings.wireframe ? wireframeMaterial : material,
  );
  group.add(mesh);

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
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
