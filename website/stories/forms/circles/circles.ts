import {
  DoubleSide,
  ExtrudeGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Path,
  Shape,
} from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import { TWO_PI } from "@utils/three/math";
import WebGLApp, { GUIWebGLApp } from "../webgl-app";

export default class CirclesSketch extends WebGLApp {
  animation = {
    speed: 1,
  };

  material = new MeshBasicMaterial({
    color: 0xffffff,
    wireframe: false,
    side: DoubleSide,
  });

  rings: Mesh[] = [];
  ringSpeeds: number[] = [];

  create() {
    this.cameras.main.fov = 40;
    this.cameras.main.position.z = 55;
    this.cameras.main.updateProjectionMatrix();
    this.createConcentricRings();
  }

  createConcentricRings(
    ringCount = 6,
    shapeRadius = 1,
    startRadius = 5,
    ringThickness = 0.5,
    edgeThickness = 1.5,
    spacing = 1.5,
  ) {
    for (let i = 0; i < ringCount; i++) {
      const t = i / (ringCount - 1); // Calculate current progress
      // const radius = MathUtils.lerp(minRadius, maxRadius, t); // Calculate current radius

      const innerRadius = startRadius + i * (ringThickness + spacing);
      const outerRadius = innerRadius + ringThickness;

      // Create ring geometry with thin tube and current radius

      // Use RingGeometry to create the base ring shape
      // Create a shape for the ring by subtracting an inner circle from an outer circle
      const shape = new Shape();
      shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

      // Create a hole (inner circle) to make it a ring
      const hole = new Path();
      hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
      shape.holes.push(hole);

      // Extrude the ring geometry to give it depth on the edges
      const extrudeSettings = {
        steps: 1,
        depth: edgeThickness,
        bevelEnabled: false,
        curveSegments: 64, // Increase the number of segments for smoother edges
      };

      const geometry = new ExtrudeGeometry(shape, extrudeSettings);

      const ring = new Mesh(geometry, this.material);

      const theta = MathUtils.lerp(0, 360, t); // Calculate current angle

      // ring.rotation.x = MathUtils.degToRad(theta); // Rotate ring to face camera
      ring.rotation.x = MathUtils.degToRad(theta); // Rotate ring to face camera
      // ring.rotation.z = MathUtils.degToRad(theta); // Rotate ring to face camera

      this.scene.add(ring);

      this.rings.push(ring); // Store each ring for later animation

      this.ringSpeeds.push(MathUtils.lerp(2, 1, t)); // Randomize ring speeds
    }
  }

  onUpdate(delta: number) {
    this.rings.forEach((ring, i) => {
      // ring.rotation.x += delta;
      ring.rotation.x += delta * this.animation.speed * this.ringSpeeds[i];
      // ring.rotation.z += delta;
    });
  }
}

/// #if DEBUG
export class GUICirclesSketch extends GUIWebGLApp {
  constructor(gui: GUIType, target: CirclesSketch) {
    super(gui, target);
    this.gui = gui;

    this.folders.animation = this.addFolder(this.gui, { title: "Animation" });
    this.folders.animation.addBinding(target.animation, "speed");
  }
}
/// #endif
