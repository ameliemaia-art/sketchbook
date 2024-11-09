import {
  AxesHelper,
  CameraHelper,
  Clock,
  Color,
  GridHelper,
  Mesh,
  NeutralToneMapping,
  Object3D,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
} from "three";
import {
  CopyShader,
  EffectComposer,
  FXAAShader,
  OrbitControls,
  OutputPass,
  RenderPass,
  ShaderPass,
  UnrealBloomPass,
  VignetteShader,
} from "three/examples/jsm/Addons.js";

import GUIController from "@utils/gui/gui";
import {
  bloomPassBinding,
  fxaaPassBinding,
  vignettePassBinding,
} from "@utils/gui/gui-post-processing-bindings";
import { GUIType } from "@utils/gui/gui-types";
import { resetCamera } from "@utils/three/camera";
import { getRenderBufferSize } from "@utils/three/rendering";
import Screenshot, { GUIScreenshot } from "@utils/three/screenshot";

export default class WebGLApp {
  renderer: WebGLRenderer;
  postProcessing: EffectComposer;
  cameras = {
    dev: new PerspectiveCamera(65, 1, 0.01, 10000),
    main: new PerspectiveCamera(65, 1, 0.01, 10000),
  };
  controls: OrbitControls;
  helpers = new Object3D();
  clock = new Clock();

  renderSize = new Vector2(1024, 1024);
  viewport = { debug: new Vector4(), main: new Vector4() };
  isRendering = false;
  rafId = 0;

  settings = {
    debugCamera: true,
    stats: true,
    helpers: false,
  };

  renderPass: RenderPass;
  fxaaPass: ShaderPass;
  bloomPass: UnrealBloomPass;
  outputPass: OutputPass;
  vignettePass: ShaderPass;
  copyPass: ShaderPass;
  copyPassToRenderTarget: ShaderPass;

  // Scenes
  scene = new Scene();

  screenshot: Screenshot;

  constructor() {
    // Renderer
    this.renderer = new WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
      stencil: false,
    });
    this.renderer.toneMapping = NeutralToneMapping;
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setScissorTest(true);
    this.renderer.setAnimationLoop(this.update);
    this.renderer.setSize(this.renderSize.x, this.renderSize.y);
    this.renderer.debug.checkShaderErrors = true;

    this.postProcessing = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.cameras.dev);
    this.fxaaPass = new ShaderPass(FXAAShader);
    this.bloomPass = new UnrealBloomPass(this.renderSize, 0.25, 0.05, 0.5);
    this.outputPass = new OutputPass();
    this.copyPass = new ShaderPass(CopyShader);
    this.vignettePass = new ShaderPass(VignetteShader);
    this.vignettePass.uniforms.offset.value = 0.8;
    this.vignettePass.uniforms.darkness.value = 1.5;
    this.copyPassToRenderTarget = new ShaderPass(CopyShader);

    this.postProcessing.addPass(this.renderPass);
    this.postProcessing.addPass(this.fxaaPass);
    this.postProcessing.addPass(this.bloomPass);
    this.postProcessing.addPass(this.outputPass);
    this.postProcessing.addPass(this.vignettePass);

    this.screenshot = new Screenshot(
      this.renderer,
      1920,
      1080,
      2,
      this.scene,
      this.cameras.dev,
    );
    this.screenshot.drawCanvasFromEffectComposer =
      this.drawCanvasFromEffectComposer;

    // Helpers
    this.controls = new OrbitControls(
      this.cameras.dev,
      this.renderer.domElement,
    );
    this.helpers.add(
      new AxesHelper(),
      new GridHelper(10, 10),
      new CameraHelper(this.cameras.main),
    );

    this.scene.add(this.helpers);

    this.cameras.main.position.z = 5;
    this.cameras.main.lookAt(0, 0, 0);

    resetCamera(this.cameras.dev, 10, new Vector3(0, 0.5, 1));

    const element = document.querySelector(
      ".sb-show-main.sb-main-padded",
    ) as HTMLElement | null;
    if (element) {
      element.style.padding = "0px";
    }

    this.scene.add(new Mesh(new SphereGeometry(1, 32, 32)));
  }

  async loadAssets() {
    return new Promise((resolve, reject) => {
      Promise.all([]).then(resolve).catch(reject);
    });
  }

  async setup(parent: HTMLDivElement) {
    parent.appendChild(this.renderer.domElement);

    await this.loadAssets();

    this.scene.add(this.cameras.main);
  }

  drawCanvasFromEffectComposer = () => {
    const camera = this.settings.debugCamera
      ? this.cameras.dev
      : this.cameras.main;
    const { width: renderBufferWidth, height: renderBufferHeight } =
      getRenderBufferSize(this.renderer);
    // Cache values
    const aspect = camera.aspect;
    const pixelRatio = this.renderer.getPixelRatio();
    // Update properties for the screenshot resolution
    camera.aspect = this.screenshot.width / this.screenshot.height;
    camera.updateProjectionMatrix();

    this.fxaaPass.material.uniforms.resolution.value.x =
      1 / (this.screenshot.width * this.screenshot.pixelRatio);
    this.fxaaPass.material.uniforms.resolution.value.y =
      1 / (this.screenshot.height * this.screenshot.pixelRatio);
    this.postProcessing.setSize(this.screenshot.width, this.screenshot.height);
    this.bloomPass.setSize(this.screenshot.width, this.screenshot.height);
    this.postProcessing.setPixelRatio(this.screenshot.pixelRatio);
    // Rendering start
    this.postProcessing.addPass(this.copyPass);
    this.postProcessing.render();

    this.copyPassToRenderTarget.render(
      this.renderer,
      this.screenshot.renderTarget,
      this.postProcessing.writeBuffer,
      0,
      false,
    );
    this.screenshot.renderTargetHelper.update(this.renderer);
    this.postProcessing.removePass(this.copyPass);
    // Rendering end
    // Restore original values
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    this.fxaaPass.material.uniforms.resolution.value.x = 1 / renderBufferWidth;
    this.fxaaPass.material.uniforms.resolution.value.y = 1 / renderBufferHeight;
    this.postProcessing.setSize(this.renderSize.x, this.renderSize.y);
    this.bloomPass.setSize(this.renderSize.x, this.renderSize.y);
    this.postProcessing.setPixelRatio(pixelRatio);

    // Draw render target helpers canvas to the screenshot canvas
    if (this.screenshot.ctx) {
      this.screenshot.ctx.drawImage(
        this.screenshot.renderTargetHelper.canvas, //
        0,
        0,
        this.screenshot.canvas.width,
        this.screenshot.canvas.height,
      );
    }
  };

  resize(width: number, height: number) {
    this.renderSize.set(width, height);

    this.renderer.setSize(this.renderSize.x, this.renderSize.y);
    this.postProcessing.setSize(this.renderSize.x, this.renderSize.y);
    this.bloomPass.setSize(this.renderSize.x, this.renderSize.y);

    this.viewport.debug.set(
      0,
      0,
      this.renderSize.x * 0.25,
      this.renderSize.y * 0.25,
    );
    this.viewport.main.set(0, 0, this.renderSize.x, this.renderSize.y);
    this.cameras.dev.aspect = this.renderSize.x / this.renderSize.y;
    this.cameras.main.aspect = this.renderSize.x / this.renderSize.y;
    this.cameras.dev.updateProjectionMatrix();
    this.cameras.main.updateProjectionMatrix();

    // Update uniforms
    const { width: renderBufferWidth, height: renderBufferHeight } =
      getRenderBufferSize(this.renderer);
    this.fxaaPass.material.uniforms.resolution.value.x = 1 / renderBufferWidth;
    this.fxaaPass.material.uniforms.resolution.value.y = 1 / renderBufferHeight;
  }

  update = () => {
    this.controls.update();

    this.renderPass.camera = this.settings.debugCamera
      ? this.cameras.dev
      : this.cameras.main;

    this.renderer.setViewport(this.viewport.main);
    this.renderer.setScissor(this.viewport.main);
    this.postProcessing.render(this.clock.getDelta());
  };

  dispose() {
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

/// #if DEBUG
export class GUIWebGLApp extends GUIController {
  constructor(gui: GUIType, target: WebGLApp) {
    super(gui);
    this.gui = gui;

    this.folders.settings = this.addFolder(this.gui, { title: "Settings" });
    this.folders.settings.addBinding(target.settings, "debugCamera");
    this.folders.settings.addBinding(target.helpers, "visible", {
      label: "helpers",
    });

    this.folders.passes = this.addFolder(this.gui, { title: "Passes" });

    this.folders.fxaa = this.addFolder(this.folders.passes, { title: "FXAA" });
    fxaaPassBinding(this.folders.fxaa, target.fxaaPass);

    this.folders.bloom = this.addFolder(this.folders.passes, {
      title: "Bloom",
    });
    bloomPassBinding(this.folders.bloom, target.bloomPass);

    this.folders.vignette = this.addFolder(this.folders.passes, {
      title: "Vignette",
    });
    vignettePassBinding(this.folders.vignette, target.vignettePass);

    this.controllers.screenshot = new GUIScreenshot(gui, target.screenshot);
  }
}
/// #endif
