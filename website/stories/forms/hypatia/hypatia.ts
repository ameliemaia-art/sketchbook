import { hypatiaSettings } from "@/stories/blueprints/hypatia/hypatia";
import {
  DoubleSide,
  ExtrudeGeometry,
  IcosahedronGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Path,
  Shape,
} from "three";

import { GUIType } from "@utils/gui/gui-types";
import { TWO_PI } from "@utils/three/math";
import WebGLApp, { GUIWebGLApp } from "../webgl-app";

export default class HypatiaSketch extends WebGLApp {
  up!: Mesh<ExtrudeGeometry, MeshBasicMaterial>;
  material = new MeshBasicMaterial({
    color: 0x333333,
    side: DoubleSide,
    wireframe: false,
  });
  wireframeMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    side: DoubleSide,
  });

  orbitMeshes: Mesh[] = [];

  outlineHorizontal!: Mesh<ExtrudeGeometry, MeshBasicMaterial>;
  outlineVerticalX!: Mesh<ExtrudeGeometry, MeshBasicMaterial>;
  outlineVerticalZ!: Mesh<ExtrudeGeometry, MeshBasicMaterial>;
  planets: Mesh<IcosahedronGeometry, MeshBasicMaterial>[] = [];

  radius = 500;
  ringSpeeds: number[] = [];

  animation = {
    speed: 1,
  };

  create() {
    this.cameras.main.position.z = 750;
    this.cameras.main.lookAt(0, 0, 0);

    // this.createHypatia();
    // this.createOutline();
    this.createOrbit();
  }

  createHypatia() {
    const mesh = new Mesh(
      new IcosahedronGeometry(
        this.radius * hypatiaSettings.form.hypatia.radius,
        3,
      ),
      new MeshBasicMaterial({ wireframe: false }),
    );
    mesh.name = "Hypatia";
    this.scene.add(mesh);
    return mesh;
  }

  createOutline() {
    const meshes = [];
    let total = 1;
    for (let i = 0; i < total; i++) {
      const theta = i * (TWO_PI / total);
      const r = this.radius / 2;

      const meshX = this.createRing(r, 1, 1, 0xffffff);
      const meshY = this.createRing(r, 1, 1, 0xffffff);
      const meshZ = this.createRing(r, 1, 1, 0xffffff);

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

    const mesh = new Mesh(
      geometry,
      new MeshBasicMaterial({ color: color, wireframe: true }),
    );

    this.scene.add(mesh);

    return mesh;
  }

  createOrbit() {
    const total = 1;
    const thickness = 2;
    const r = this.radius / 2;
    const minRadius = r / 5;
    const maxRadius = r;

    const SM_AXIS_RATIO = 1 / Math.sqrt(3); // ~0.577

    for (let i = 0; i < total; i++) {
      const p = i / (total - 1) || 0;
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
        depth: thickness,
        bevelEnabled: false,
        curveSegments: 64, // Increase the number of segments for smoother edges
      };

      const geometry = new ExtrudeGeometry(shape, extrudeSettings);

      const ring = new Mesh(geometry, this.material);
      ring.add(new Mesh(geometry, this.wireframeMaterial));

      // ring.rotation.x = Math.PI / 2;
      let theta = MathUtils.lerp(0, 45, p); // Calculate current angle

      // ring.rotation.x = MathUtils.degToRad(theta); // Rotate ring to face camera
      // ring.rotation.x = MathUtils.degToRad(theta); // Rotate ring to face camera
      // ring.rotation.x = Math.PI / 2;
      ring.scale.z = perspectiveFactorY;

      this.ringSpeeds.push(MathUtils.lerp(2, 1, p)); // Randomize ring speeds

      this.scene.add(ring);

      this.orbitMeshes.push(ring); // Store each ring for later animation

      // Planet
      if (false) {
        const startAngle = Math.PI;
        theta = MathUtils.lerp(
          startAngle,
          startAngle + MathUtils.degToRad(hypatiaSettings.form.planets.spiral),
          p,
        );

        let mesh = new Mesh(
          new IcosahedronGeometry(
            radius * hypatiaSettings.form.planets.radius * 2,
            3,
          ),
          new MeshBasicMaterial({ wireframe: false, color: 0xffffff }),
        );
        mesh.position.set(
          Math.cos(theta) * radius,
          Math.sin(theta) * radius * perspectiveFactorY,
          0,
        );
        mesh.userData.theta = theta;
        mesh.userData.radius = radius;
        mesh.userData.perspectiveFactorY = perspectiveFactorY;
        mesh.name = `Planet-0-${i}`;
        ring.add(mesh);

        this.planets.push(mesh);

        theta =
          Math.PI +
          MathUtils.lerp(
            startAngle,
            startAngle +
              MathUtils.degToRad(hypatiaSettings.form.planets.spiral),
            p,
          );

        mesh = new Mesh(
          new IcosahedronGeometry(
            radius * hypatiaSettings.form.planets.radius * 2,
            3,
          ),
          new MeshBasicMaterial({ wireframe: false, color: 0xffffff }),
        );
        mesh.userData.theta = theta;
        mesh.userData.radius = radius;
        mesh.userData.perspectiveFactorY = perspectiveFactorY;
        mesh.position.set(
          Math.cos(theta) * radius,
          Math.sin(theta) * radius * perspectiveFactorY,
          0,
        );
        mesh.name = `Planet-1-${i}`;
        ring.add(mesh);

        this.planets.push(mesh);
      }
    }
  }

  onUpdate(delta: number) {
    return;
    this.planets.forEach((mesh: Mesh) => {
      mesh.userData.theta += delta;
      mesh.position.set(
        Math.cos(mesh.userData.theta) * mesh.userData.radius,
        Math.sin(mesh.userData.theta) *
          mesh.userData.radius *
          mesh.userData.perspectiveFactorY,
        0,
      );
    });

    this.orbitMeshes.forEach((ring, i) => {
      // ring.rotation.x += delta;
      ring.rotation.x += delta * this.animation.speed * this.ringSpeeds[i];
      // ring.rotation.z += delta;
    });
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
