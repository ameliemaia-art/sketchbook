import {
  DoubleSide,
  ExtrudeGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Path,
  RingGeometry,
  Shape,
  TubeGeometry,
} from "three";

import { GUIType } from "@utils/gui/gui-types";
import { TWO_PI } from "@utils/three/math";
import WebGLApp, { GUIWebGLApp } from "../webgl-app";

export default class HypatiaSketch extends WebGLApp {
  up!: Mesh<ExtrudeGeometry, MeshBasicMaterial>;
  material = new MeshBasicMaterial({ color: 0xffffff });
  orbitMeshes: Mesh[] = [];

  outlineHorizontal!: Mesh<ExtrudeGeometry, MeshBasicMaterial>;
  outlineVerticalX!: Mesh<ExtrudeGeometry, MeshBasicMaterial>;
  outlineVerticalZ!: Mesh<ExtrudeGeometry, MeshBasicMaterial>;

  create() {
    this.cameras.main.position.z = 1000;
    this.cameras.main.lookAt(0, 0, 0);

    this.createOutline();

    this.createConcentricRings();
  }

  createOutline() {
    const meshes = [];
    let total = 3;
    for (let i = 0; i < total; i++) {
      const theta = i * (TWO_PI / total);

      const meshX = this.createRing(250, 1, 1, 0xffffff);
      const meshY = this.createRing(250, 1, 1, 0xffffff);
      const meshZ = this.createRing(250, 1, 1, 0xffffff);

      meshX.rotation.x = theta;
      meshY.rotation.y = theta;
      meshZ.rotation.y = theta;
      meshZ.rotation.x = Math.PI / 2;

      meshes.push(meshX, meshY, meshZ);
    }
  }

  createRing(
    radius: number,
    thickness: number,
    depth: number,
    color = 0xff0000,
  ) {
    // Create ring geometry with thin tube and current radius

    // Use RingGeometry to create the base ring shape
    // Create a shape for the ring by subtracting an inner circle from an outer circle
    const shape = new Shape();
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);

    // Create a hole (inner circle) to make it a ring
    const hole = new Path();
    hole.absarc(0, 0, radius - thickness, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geometry = new ExtrudeGeometry(shape, {
      steps: 1,
      depth: depth,
      bevelEnabled: false,
      curveSegments: 64, // Increase the number of segments for smoother edges
    });

    const mesh = new Mesh(geometry, new MeshBasicMaterial({ color: color }));

    this.scene.add(mesh);

    return mesh;
  }

  createConcentricRings() {
    const total = 7;
    const thickness = 1;
    const radius = 250;
    const minRadius = radius / 5;
    const maxRadius = radius;
    const depth = 1;

    const SM_AXIS_RATIO = 1 / Math.sqrt(3); // ~0.577

    for (let i = 0; i < total; i++) {
      const p = i / (total - 1);
      const radius = MathUtils.lerp(minRadius, maxRadius, p);

      const perspectiveFactorY = MathUtils.lerp(
        SM_AXIS_RATIO,
        SM_AXIS_RATIO * (1 + SM_AXIS_RATIO),
        p,
      );

      // Create ring geometry with thin tube and current radius

      // Use RingGeometry to create the base ring shape
      // Create a shape for the ring by subtracting an inner circle from an outer circle
      const shape = new Shape();
      shape.absellipse(
        0,
        0,
        radius,
        radius * perspectiveFactorY,
        0,
        Math.PI * 2,
        false,
      );

      // Create a hole (inner circle) to make it a ring
      const hole = new Path();
      // hole.absarc(0, 0, radius - thickness, 0, Math.PI * 2, true);
      hole.absellipse(
        0,
        0,
        radius - thickness,
        (radius - thickness) * perspectiveFactorY,
        0,
        Math.PI * 2,
        true,
      );
      shape.holes.push(hole);

      // Extrude the ring geometry to give it depth on the edges
      const extrudeSettings = {
        steps: 1,
        depth,
        bevelEnabled: false,
        curveSegments: 64, // Increase the number of segments for smoother edges
      };

      const geometry = new ExtrudeGeometry(shape, extrudeSettings);

      const ring = new Mesh(geometry, this.material);

      // ring.rotation.x = Math.PI / 2;
      const theta = MathUtils.lerp(0, 45, p); // Calculate current angle

      // ring.rotation.x = MathUtils.degToRad(theta); // Rotate ring to face camera
      // ring.rotation.x = MathUtils.degToRad(theta); // Rotate ring to face camera
      ring.rotation.x = Math.PI / 2;
      ring.scale.z = perspectiveFactorY;

      this.scene.add(ring);

      this.orbitMeshes.push(ring); // Store each ring for later animation
    }
  }
}

/// #if DEBUG
export class GUIHypatiaSketch extends GUIWebGLApp {
  constructor(gui: GUIType, target: WebGLApp) {
    super(gui, target);
    this.gui = gui;
  }
}
/// #endif
