import {
  BufferGeometry,
  DoubleSide,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  Vector3,
} from "three";
import {
  Line2,
  LineGeometry,
  LineMaterial,
  WireframeGeometry2,
} from "three/examples/jsm/Addons.js";

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
    globals: {
      id: "globals",
      lineWidth: 0.025,
    },
    outline: {
      id: "outline",
      radius: 5,
      visible: true,
    },
    rings: {
      id: "rings",
      visible: true,
      count: 6,
      circleRadius: 5,
      radius: 2.5,
    },
    lines: {
      id: "lines",
      visible: true,
    },
    icosahedron: {
      id: "icosahedron",
      visible: true,
      radius: 5,
    },
  };

  outline: Mesh<RingGeometry, MeshBasicMaterial> | null = null;
  lines: Line2 | null = null;
  icoshaedron: Mesh<WireframeGeometry2, LineMaterial> | null = null;
  ringGroup = new Group();

  constructor() {
    super();
    this.settings.debugCamera = true;
    this.settings.helpers = true;
  }

  create = () => {
    this.createOutline();
    this.createRings();
    // this.createSolid();
    this.createLinesBetweenCircles(
      this.ringGroup.children.map((mesh) => mesh.position),
    );
  };

  createSolid() {
    if (this.icoshaedron) {
      disposeObjects(this.icoshaedron);
    }
    // create me an icosahedron
    const geometry = new WireframeGeometry2(
      new IcosahedronGeometry(this.config.icosahedron.radius, 0),
    );
    geometry.rotateY(Math.PI / 2);
    geometry.rotateX(Math.PI / 4);
    const material = new LineMaterial({
      color: 0xffffff,
      linewidth: this.config.globals.lineWidth, // in world units with size attenuation, pixels otherwise
      worldUnits: true,
    });

    this.icoshaedron = new Mesh(geometry, material);
    this.icoshaedron.name = "Icosahedron";
    this.scene.add(this.icoshaedron);
  }

  createOutline() {
    if (this.outline) {
      disposeObjects(this.outline);
    }

    const { radius } = this.config.outline;
    const outerRadius = radius;
    const innerRadius = outerRadius - this.config.globals.lineWidth; // Adjusted for consistent line width

    this.outline = new Mesh(
      new RingGeometry(innerRadius, outerRadius, 64),
      this.lineMaterial,
    );
    this.outline.name = "outline";
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
      const innerRadius = outerRadius - this.config.globals.lineWidth; // Adjusted for consistent line width

      const mesh = new Mesh(
        new RingGeometry(innerRadius, outerRadius, 64),
        this.lineMaterial,
      );
      mesh.position.set(x, y, z);
      this.ringGroup.add(mesh);
    }

    this.scene.add(this.ringGroup);
  }

  createLinesBetweenCircles(positions: Vector3[]) {
    // Dispose of any previous lines
    if (this.lines) {
      disposeObjects(this.lines);
    }

    const points = [];
    const { count, circleRadius } = this.config.rings;

    // Calculate circle positions and add points to form a closed loop
    for (let i = 0; i < positions.length; i++) {
      points.push(positions[i]);
    }
    // Close the loop by connecting the last point to the first
    points.push(points[0]);

    const p = points.map((v) => [v.x, v.y, v.z]).flat();

    const geometry = new LineGeometry();
    geometry.setPositions(p);

    const matLine = new LineMaterial({
      color: 0xffffff,
      linewidth: this.config.globals.lineWidth, // in world units with size attenuation, pixels otherwise
      worldUnits: true,
    });

    this.lines = new Line2(geometry, matLine);
    this.lines.computeLineDistances();
    this.lines.scale.set(1, 1, 1);
    this.lines.name = "lines";

    this.scene.add(this.lines);
  }

  onVisibilityChange = () => {
    this.ringGroup.visible = this.config.rings.visible;
    if (this.outline) {
      this.outline.visible = this.config.outline.visible;
    }
    if (this.lines) {
      this.lines.visible = this.config.lines.visible;
    }
  };
}

/// #if DEBUG
export class GUIBlueprintSketch extends GUIWebGLApp {
  constructor(gui: GUIType, target: BlueprintSketch) {
    super(gui, target);
    this.gui = gui;

    // Globals Folder
    this.folders.globals = this.addFolder(this.gui, { title: "Globals" });
    this.addBinding(this.folders.globals, target.config.globals, "lineWidth", {
      min: 0.01,
      max: 1,
    }).on("change", target.create);

    // Rings Folder
    this.folders.rings = this.addFolder(this.gui, { title: "Rings" });
    this.addBinding(this.folders.rings, target.config.rings, "count", {
      min: 1,
      max: 50,
      step: 1,
    }).on("change", target.create);
    this.addBinding(this.folders.rings, target.config.rings, "circleRadius", {
      min: 0.1,
      max: 10,
    }).on("change", target.create);
    this.addBinding(this.folders.rings, target.config.rings, "radius", {
      min: 0.01,
      max: 1,
    }).on("change", target.create);
    this.addBinding(this.folders.rings, target.config.rings, "visible").on(
      "change",
      target.onVisibilityChange,
    );

    // Outline Folder
    this.folders.outline = this.addFolder(this.gui, { title: "Outline" });
    this.addBinding(this.folders.outline, target.config.outline, "radius", {
      min: 0.01,
    }).on("change", target.create);
    this.addBinding(this.folders.outline, target.config.outline, "visible").on(
      "change",
      target.onVisibilityChange,
    );

    // Lines Folder
    this.folders.lines = this.addFolder(this.gui, { title: "Lines" });
    this.addBinding(this.folders.lines, target.config.lines, "visible").on(
      "change",
      target.onVisibilityChange,
    );
  }
}
/// #endif
