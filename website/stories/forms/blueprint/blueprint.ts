import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
} from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import { disposeObjects } from "@utils/three/dispose";
import { TWO_PI } from "@utils/three/math";
import WebGLApp, { GUIWebGLApp } from "../webgl-app";

export default class BlueprintSketch extends WebGLApp {
  lineMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    wireframe: false,
    side: DoubleSide,
  });

  config = {
    line: {
      width: 0.025,
    },
    outline: {
      radius: 5,
    },
    rings: {
      count: 6,
      circleRadius: 5,
      radius: 0.5,
    },
  };

  outline: Mesh<RingGeometry, MeshBasicMaterial> | null = null;
  ringGroup = new Group();

  constructor() {
    super();
    this.settings.debugCamera = true;
    this.settings.helpers = true;
  }

  create = () => {
    this.createOutline();
    this.createRings();
  };

  createOutline() {
    if (this.outline) {
      disposeObjects(this.outline);
    }

    const { radius } = this.config.outline;
    const outerRadius = radius;
    const innerRadius = outerRadius - this.config.line.width; // Adjusted for consistent line width

    this.outline = new Mesh(
      new RingGeometry(innerRadius, outerRadius, 64),
      this.lineMaterial,
    );
    this.scene.add(this.outline);
  }

  createRings() {
    disposeObjects(this.ringGroup);
    this.ringGroup = new Group();
    this.ringGroup.name = "Rings";

    const { count, circleRadius, radius } = this.config.rings;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * TWO_PI;
      const x = Math.cos(theta) * circleRadius;
      const y = Math.sin(theta) * circleRadius;
      const z = 0;

      const outerRadius = radius;
      const innerRadius = outerRadius - this.config.line.width; // Adjusted for consistent line width

      const mesh = new Mesh(
        new RingGeometry(innerRadius, outerRadius, 32),
        this.lineMaterial,
      );
      mesh.position.set(x, y, z);
      this.ringGroup.add(mesh);
    }

    this.scene.add(this.ringGroup);
  }
}

/// #if DEBUG
export class GUIBlueprintSketch extends GUIWebGLApp {
  constructor(gui: GUIType, target: BlueprintSketch) {
    super(gui, target);
    this.gui = gui;

    this.folders.line = this.addFolder(this.gui, { title: "Line" });
    this.folders.line
      .addBinding(target.config.line, "width", {
        min: 0.01,
        max: 1,
      })
      .on("change", target.create);

    this.folders.rings = this.addFolder(this.gui, { title: "Rings" });
    this.folders.rings
      .addBinding(target.config.rings, "count", {
        min: 1,
        max: 50,
        step: 1,
      })
      .on("change", target.create);
    this.folders.rings
      .addBinding(target.config.rings, "circleRadius", {
        min: 0.1,
        max: 10,
      })
      .on("change", target.create);
    this.folders.rings
      .addBinding(target.config.rings, "radius", {
        min: 0.01,
        max: 1,
      })
      .on("change", target.create);

    this.folders.outline = this.addFolder(this.gui, { title: "Outline" });
    this.folders.outline
      .addBinding(target.config.outline, "radius", {
        min: 0.01,
      })
      .on("change", target.create);
  }
}
/// #endif
