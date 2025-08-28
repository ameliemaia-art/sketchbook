import {
  BufferGeometry,
  LatheGeometry,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3,
} from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import { wireframeMaterial } from "../../materials/materials";
import { ColumnScotia, generateProfilePoints } from "./column-scotia-geometry";

export type ColumnEchinus = ColumnScotia;

export function columnEchinus(settings: ColumnEchinus, material: Material) {
  const profile = generateProfilePoints({
    topRadius: settings.bottomRadius,
    topHeight: settings.bottomHeight,
    bottomRadius: settings.topRadius,
    bottomHeight: settings.topHeight,
    height: settings.height,
    divisions: settings.divisions,
    radialSegments: settings.radialSegments,
  });

  const geometry = new LatheGeometry(profile, settings.radialSegments);
  geometry.computeVertexNormals();

  const dimensions = getGeometryDimensions(geometry);

  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, -dimensions.height, 0),
  );

  geometry.applyMatrix4(new Matrix4().makeRotationX(Math.PI));

  const m = new Mesh(
    geometry,
    settings.wireframe ? wireframeMaterial : material,
  );

  // m.add(
  //   new Mesh(
  //     new SphereGeometry(1, 32, 32),
  //     new MeshBasicMaterial({ color: 0xff0000 }),
  //   ),
  // );
  return m;
}

export function getGeometryDimensions(geometry: BufferGeometry) {
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox!;

  return {
    height: boundingBox.max.y - boundingBox.min.y,
    width: boundingBox.max.x - boundingBox.min.x,
    depth: boundingBox.max.z - boundingBox.min.z,
    center: boundingBox.getCenter(new Vector3()),
    size: boundingBox.getSize(new Vector3()),
    boundingBox: boundingBox.clone(),
  };
}

/// #if DEBUG
export class GUIEchinus extends GUIController {
  constructor(
    gui: GUIType,
    public target: ColumnEchinus,
    title = "Echinus",
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title });

    this.gui
      .addBinding(target, "bottomRadius", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "topRadius", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "height", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "bottomHeight", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "topHeight", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "divisions", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "radialSegments", { min: 0 })
      .on("change", this.onChange);
    this.gui.addBinding(target, "helper").on("change", this.onChange);
    this.gui.addBinding(target, "wireframe").on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
