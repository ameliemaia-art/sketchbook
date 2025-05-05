import {
  CapsuleGeometry,
  CylinderGeometry,
  Group,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  Scene,
  Vector3,
} from "three";
import {
  Brush,
  Evaluator,
  HOLLOW_SUBTRACTION,
  SUBTRACTION,
} from "three-bvh-csg";

export interface CSGCylinderSettings {
  height: number;
  mainRadius: number;
  holeRadiusScalar: number; // Scalar of mainRadius (0-1)
  holeDistanceScalar: number;
  numHoles: number;
  holeHeightRatio: number;
  holeScale: number; // Scale factor along the normal direction (0-1)
}

export const defaultCSGCylinderSettings: CSGCylinderSettings = {
  height: 100,
  mainRadius: 25,
  holeRadiusScalar: 0.25, // 50% of main radius
  numHoles: 8,
  holeHeightRatio: 0.85,
  holeDistanceScalar: 0.5,
  holeScale: 0.5, // Scale to 50% along normal
};

export class CSGCylinder {
  private scene: Scene;
  private mainCylinder!: Brush;
  private smallCylinders: Brush[];
  private result!: Mesh;
  private evaluator: Evaluator;
  private debugGroup: Group = new Group();
  private showDebug: boolean = false;
  private settings: CSGCylinderSettings;

  constructor(scene: Scene, settings: Partial<CSGCylinderSettings> = {}) {
    this.scene = scene;
    this.evaluator = new Evaluator();
    this.smallCylinders = [];
    this.settings = { ...defaultCSGCylinderSettings, ...settings };
    this.scene.add(this.debugGroup);
    this.createMainCylinder();
    this.createSmallCylinders();
    this.performCSG();
  }

  private createMainCylinder() {
    const geometry = new CylinderGeometry(
      this.settings.mainRadius,
      this.settings.mainRadius,
      this.settings.height,
      32,
    );
    this.mainCylinder = new Brush(geometry);
    this.mainCylinder.position.y = this.settings.height / 2;

    // Debug visualization
    if (this.showDebug) {
      const debugMesh = new Mesh(
        geometry,
        new MeshBasicMaterial({
          color: 0xff0000,
          wireframe: false,
          transparent: true,
          opacity: 0.5,
        }),
      );
      debugMesh.position.y = this.settings.height / 2;
      this.debugGroup.add(debugMesh);
    }
  }

  private createSmallCylinders() {
    const holeHeight = this.settings.height * this.settings.holeHeightRatio;
    const holeRadius =
      this.settings.mainRadius * this.settings.holeRadiusScalar;
    const smallGeometry = new CapsuleGeometry(
      holeRadius,
      holeHeight - holeRadius * 2,
      32,
      16,
    );

    // Calculate the actual hole distance from the center
    const holeDistance =
      this.settings.mainRadius - (holeRadius * this.settings.holeScale) / 2;

    for (let i = 0; i < this.settings.numHoles; i++) {
      const angle = (i / this.settings.numHoles) * Math.PI * 2;
      const x = Math.cos(angle) * holeDistance;
      const z = Math.sin(angle) * holeDistance;

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
        new Vector3(1, 1, this.settings.holeScale), // scale
      );

      const cylinder = new Brush(smallGeometry);
      cylinder.applyMatrix4(matrix);
      cylinder.position.set(x, 0, z);
      cylinder.updateMatrixWorld();
      this.smallCylinders.push(cylinder);

      // Debug visualization
      if (this.showDebug) {
        const debugMesh = new Mesh(
          smallGeometry,
          new MeshBasicMaterial({
            color: 0xff0000,
            wireframe: false,
            transparent: true,
            opacity: 0.5,
          }),
        );
        debugMesh.applyMatrix4(matrix);
        debugMesh.position.set(x, 0, z);
        this.debugGroup.add(debugMesh);
      }
    }
  }

  private performCSG() {
    // Start with the main cylinder
    let result = this.mainCylinder;

    // Subtract each small cylinder
    for (const smallCylinder of this.smallCylinders) {
      result = this.evaluator.evaluate(result, smallCylinder, SUBTRACTION);
    }

    // Convert the result to a regular Three.Mesh
    this.result = new Mesh(
      result.geometry,
      new MeshStandardMaterial({
        wireframe: false,
      }),
    );
    this.result.castShadow = true;
    // this.result.receiveShadow = true;
    this.result.position.y = this.settings.height / 2;

    // Add the result to the scene
    this.scene.add(this.result);
  }

  public update() {
    // You can add animation or updates here if needed
  }

  public dispose() {
    this.scene.remove(this.result);
    this.scene.remove(this.debugGroup);
    this.result.geometry.dispose();
    if (this.result.material instanceof Material) {
      this.result.material.dispose();
    }
    this.debugGroup.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();
        if (child.material instanceof Material) {
          child.material.dispose();
        }
      }
    });
  }

  public toggleDebug() {
    this.showDebug = !this.showDebug;
    this.debugGroup.visible = this.showDebug;
  }
}
