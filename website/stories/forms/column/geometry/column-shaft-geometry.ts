import {
  BufferGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  Group,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  Scene,
  Vector3,
} from "three";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import { TWO_PI } from "@utils/three/math";
import { wireframeMaterial } from "../../materials/materials";
import { getGeometryDimensions } from "./column-echinus-geometry";

export type Flutes = {
  total: number;
  radius: number;
  height: number;
  scale: number;
  capSegments: number;
  radialSegments: number;
};

export type ColumnShaft = {
  height: number;
  radius: number;
  radialSegments: number;
  flutes: Flutes;
  helper: boolean;
  wireframe: boolean;
};

const evaluator = new Evaluator();

function performCSG(settings: ColumnShaft, geometry: BufferGeometry) {
  // Create capsules around the shaft
  const cylinders: Brush[] = [];

  // Calculate the actual hole distance from the center
  // const radius =
  //   settings.radius - (settings.flutes.radius * settings.flutes.radius) / 2;

  for (let i = 0; i < settings.flutes.total; i++) {
    const theta = i * (TWO_PI / settings.flutes.total);
    const x = Math.cos(theta) * settings.radius;
    const z = Math.sin(theta) * settings.radius;
    const capsule = new Mesh(
      new CapsuleGeometry(
        settings.flutes.radius,
        settings.flutes.height - settings.flutes.radius * 2,
        settings.flutes.capSegments,
        settings.flutes.radialSegments,
      ),
    );
    capsule.position.set(x, 0, z);

    // Create the normal vector (direction from center to the capsule)
    const normal = new Vector3(x, 0, z).normalize();

    // Create a quaternion to rotate the capsule to face the normal
    const quaternion = new Quaternion();
    quaternion.setFromUnitVectors(new Vector3(0, 0, 1), normal);

    // Create the transform matrix
    const matrix = new Matrix4();
    matrix.compose(
      new Vector3(0, 0, 0), // position (will be set later)
      quaternion, // rotation
      new Vector3(1, 1, settings.flutes.scale), // scale
    );

    capsule.applyMatrix4(matrix);
    capsule.updateMatrixWorld();

    const cylinder = new Brush(capsule.geometry);
    cylinder.applyMatrix4(capsule.matrixWorld);
    cylinder.position.set(x, 0, z);
    cylinder.updateMatrixWorld();
    cylinders.push(cylinder);
  }

  // Subtract each small cylinder
  let result = new Brush(geometry);
  for (const smallCylinder of cylinders) {
    result = evaluator.evaluate(result, smallCylinder, SUBTRACTION);
  }

  return result.geometry;
}

export function columnShaft(
  settings: ColumnShaft,
  material: Material,
  scene: Scene,
) {
  let geometry: BufferGeometry = new CylinderGeometry(
    settings.radius,
    settings.radius,
    settings.height,
    settings.radialSegments,
    1,
    false,
  );

  geometry = performCSG(settings, geometry);

  const dimensions = getGeometryDimensions(geometry);

  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, dimensions.height / 2, 0),
  );

  return new Mesh(geometry, settings.wireframe ? wireframeMaterial : material);
}

/// #if DEBUG
export class GUIColumnShaft extends GUIController {
  constructor(
    gui: GUIType,
    public target: ColumnShaft,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Shaft" });
    this.gui
      .addBinding(target, "height", { min: 1 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "radius", { min: 0.1 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "radialSegments", { min: 3 })
      .on("change", this.onChange);

    this.folders.flutes = this.addFolder(this.gui, { title: "Flutes" });
    this.folders.flutes.addBinding(target.flutes, "total", { min: 4 });
    this.folders.flutes.addBinding(target.flutes, "radialSegments", { min: 3 });
    this.folders.flutes.addBinding(target.flutes, "capSegments", { min: 3 });
    this.folders.flutes.addBinding(target.flutes, "scale", { min: 0 });
    this.folders.flutes
      .addButton({ title: "Rebuild" })
      .on("click", this.onChange);
    this.gui.addBinding(target, "helper").on("change", this.onChange);
    this.gui.addBinding(target, "wireframe").on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
