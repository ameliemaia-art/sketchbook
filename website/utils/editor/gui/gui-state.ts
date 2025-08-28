import type { Object3D, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class folderstate {
  renderer!: WebGLRenderer;
  scene!: Scene;
  camera!: PerspectiveCamera;
  controls!: OrbitControls;
  activeObject!: Object3D;
}

const state = new folderstate();

export default state;
