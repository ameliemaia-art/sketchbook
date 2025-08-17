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

export type ColumnShaft = {
  height: number;
  radius: number;
  flutes: number;
  fluteRadius: number;
  fluteHeight: number;
  radialSegments: number;
};

const evaluator = new Evaluator();

function performCSG(settings: ColumnShaft, geometry: BufferGeometry) {
  // Create capsules around the shaft
  const cylinders: Brush[] = [];
  for (let i = 0; i < settings.flutes; i++) {
    const theta = i * (TWO_PI / settings.flutes);
    const x = Math.cos(theta) * settings.radius;
    const z = Math.sin(theta) * settings.radius;
    const capsule = new Mesh(
      new CapsuleGeometry(
        settings.fluteRadius,
        settings.fluteHeight - settings.fluteRadius * 2,
        16,
        32,
      ),
    );
    capsule.position.set(x, 0, z);
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

  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, settings.height / 2, 0),
  );

  return new Mesh(geometry, material);
}

/// #if DEBUG
export class GUIShaft extends GUIController {
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
      .addBinding(target, "flutes", { min: 4 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "radialSegments", { min: 3 })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
