import { ShaderPass, UnrealBloomPass } from "three/examples/jsm/Addons.js";

import { GUIType } from "../gui/gui-types";

export function vignettePassBinding(gui: GUIType, object: ShaderPass) {
  gui.addBinding(object, "enabled");
  gui.addBinding(object.uniforms.offset, "value", { min: 0, max: 5 });
  gui.addBinding(object.uniforms.darkness, "value", { min: 0, max: 5 });
}

export function fxaaPassBinding(gui: GUIType, object: ShaderPass) {
  gui.addBinding(object, "enabled");
}

export function bloomPassBinding(gui: GUIType, object: UnrealBloomPass) {
  gui.addBinding(object, "enabled");
  gui.addBinding(object, "strength", { min: 0, max: 5 });
  gui.addBinding(object, "threshold", { min: 0, max: 5 });
  gui.addBinding(object, "radius", { min: 0, max: 1 });
}

export function tintPassBinding(gui: GUIType, object: ShaderPass) {
  gui.addBinding(object.material.uniforms.transition, "value", {
    min: 0,
    max: 1,
    label: "transition",
  });
}
