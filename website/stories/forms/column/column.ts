import Column, { GUIColumn } from "@/stories/blueprints/column/column";
import { computeGreekColumnShaftCurveData } from "@/stories/blueprints/column/column-geometry";
import { CSGCylinder } from "@/stories/blueprints/csg-cylinder/csg-cylinder";
import paper from "paper";
import { doc } from "prettier";
import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  Shape,
  Vector2,
  Vector3,
} from "three";

import { GUIType } from "@utils/gui/gui-types";
import { resetCamera } from "@utils/three/camera";
import WebGLApp, { GUIWebGLApp } from "../webgl-app";

export interface CurveSegment {
  curvePoints: Vector2[];
  gapLine: { start: Vector2; end: Vector2 };
}

export default class ColumnForm extends WebGLApp {
  up!: Mesh<ExtrudeGeometry, MeshBasicMaterial>;
  material = new MeshStandardMaterial({
    color: 0xffffff,
    side: DoubleSide,
    wireframe: false,
  });
  wireframeMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    side: DoubleSide,
  });

  sketch!: Column;
  columnMesh?: Mesh<ExtrudeGeometry, MeshStandardMaterial>;
  csgCylinder?: CSGCylinder;

  create() {
    this.cameras.main.position.z = 750;
    this.cameras.main.lookAt(0, 0, 0);

    resetCamera(this.cameras.dev, 150, new Vector3(0, 0.5, 1));

    this.settings.helpers = false;
    this.bloomPass.enabled = false;
    // Add soft natural lighting to the scene.
    this.createLights();
    this.createFloor();

    // Create the CSG cylinder
    this.csgCylinder = new CSGCylinder(this.scene);

    if (this.parent) {
      const canvas = document.createElement("canvas");
      Object.assign(canvas.style, {
        position: "absolute",
        top: "0px",
        left: "0px",
        zIndex: "100",
      });
      document.body.appendChild(canvas);
      this.sketch = new Column(this.parent, canvas);

      this.dispatchEvent({ type: "create" });

      this.generate();
    }
  }

  /**
   * Creates a box floor that receives shadows.
   * The floor is a large, flat box with a small thickness.
   *
   * @returns A Mesh representing the floor.
   */
  createFloor() {
    // Create a box geometry: width, height, depth.
    const width = 150;
    const height = 1;
    const depth = 150;
    const geometry = new BoxGeometry(width, height, depth);

    // Create a material for the floor.
    const material = new MeshStandardMaterial({ color: 0xffffff });

    // Create the mesh.
    const floor = new Mesh(geometry, material);

    // Enable the floor to receive shadows.
    floor.receiveShadow = true;

    // Position the floor so that its top is at y = 0.
    // (Since BoxGeometry is centered, move it up by half its height.)
    floor.position.y = -height / 2;

    this.scene.add(floor);
  }

  createLights() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.shadowMap.autoUpdate = true;

    // Soft ambient light for overall illumination.
    const ambientLight = new AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Hemisphere light for natural outdoor lighting (sky and ground).
    const hemisphereLight = new HemisphereLight(0xbfd1e5, 0xf5f5f5, 0.6);
    this.scene.add(hemisphereLight);

    // Directional light to cast soft shadows.
    const directionalLight = new DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;

    // Configure shadow properties for the directional light.
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 250;
    // Optionally adjust the shadow camera frustum for better shadow coverage.
    directionalLight.shadow.camera.left = -150;
    directionalLight.shadow.camera.right = 150;
    directionalLight.shadow.camera.top = 150;
    directionalLight.shadow.camera.bottom = -150;
    directionalLight.shadow.bias = -0.015;

    this.scene.add(directionalLight);
  }

  createGreekColumnShape(curveData: CurveSegment[]): Shape {
    const shape = new Shape();

    if (!curveData || curveData.length === 0) {
      return shape;
    }

    // Start at the first point of the first segment.
    const firstPoint = curveData[0].curvePoints[0];
    shape.moveTo(firstPoint.x, firstPoint.y);

    // Loop over each segment to create the outer contour.
    for (const segment of curveData) {
      // Add the computed curve points.
      // (Assuming the first point is already added, so start from index 1)
      for (let i = 1; i < segment.curvePoints.length; i++) {
        const pt = segment.curvePoints[i];
        shape.lineTo(pt.x, pt.y);
      }
      // Add the gap line endpoint (connecting to the next segment).
      shape.lineTo(segment.gapLine.end.x, segment.gapLine.end.y);
    }

    // Ensure the shape is closed.
    shape.closePath();
    return shape;
  }

  createGreekColumnExtrudedMesh(
    curveData: CurveSegment[],
    depth: number,
  ): Mesh<ExtrudeGeometry, MeshStandardMaterial> {
    // Create the shape.
    const shape = this.createGreekColumnShape(curveData);

    // Define the extrusion settings.
    const extrudeSettings = {
      steps: 1,
      depth: depth,
      bevelEnabled: false,
    };

    // Create the extruded geometry.
    const geometry = new ExtrudeGeometry(shape, extrudeSettings);

    // Create and return the mesh.
    return new Mesh(geometry, this.material);
  }

  generate = () => {
    if (this.columnMesh) {
      this.scene.remove(this.columnMesh);
      this.columnMesh.geometry.dispose();
      this.columnMesh = undefined;
    }

    const radius = 25;
    const rawCurveData = computeGreekColumnShaftCurveData(
      new paper.Point(0, 0),
      radius,
      this.sketch.settings.form.flutes,
      this.sketch.settings.form.fluteGap * radius,
      this.sketch.settings.form.fluteDepth,
      this.sketch.settings.form.inset,
      this.sketch.settings.form.insetCurveFactor,
      false,
      this.sketch.layers.form,
    );

    const curveData: CurveSegment[] = rawCurveData.map((segment) => ({
      curvePoints: segment.curvePoints.map((pt) => new Vector2(pt.x, pt.y)),
      gapLine: {
        start: new Vector2(segment.gapLine.start.x, segment.gapLine.start.y),
        end: new Vector2(segment.gapLine.end.x, segment.gapLine.end.y),
      },
    }));

    // Create the extruded mesh with a specified depth.
    const depth = 25;

    this.columnMesh = this.createGreekColumnExtrudedMesh(curveData, depth);
    if (this.columnMesh) {
      this.columnMesh.receiveShadow = true;
      this.columnMesh.castShadow = true;
      this.columnMesh.rotateX(-Math.PI / 2);
    }

    this.scene.add(this.columnMesh);
  };

  createColumnCurve() {}

  toggleCSGDebug() {
    if (this.csgCylinder) {
      this.csgCylinder.toggleDebug();
    }
  }

  onUpdate(delta: number) {
    if (this.csgCylinder) {
      this.csgCylinder.update();
    }
  }

  dispose() {
    super.dispose();
    if (this.csgCylinder) {
      this.csgCylinder.dispose();
    }
  }
}

/// #if DEBUG
export class GUIColumnForm extends GUIWebGLApp {
  constructor(
    gui: GUIType,
    public target: ColumnForm,
  ) {
    super(gui, target);
    this.gui = gui;

    target.addEventListener("create", this.onCreate);
  }

  onCreate = () => {
    this.controllers.column = new GUIColumn(
      this.gui,
      this.target.sketch,
      this.target.generate,
    );
  };
}
/// #endif
