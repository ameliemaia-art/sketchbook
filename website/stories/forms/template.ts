import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import WebGLApp, { GUIWebGLApp } from "./webgl-app";

export default class TemplateSketch extends WebGLApp {}

/// #if DEBUG
export class GUITemplateSketch extends GUIWebGLApp {
  constructor(gui: GUIType, target: WebGLApp) {
    super(gui, target);
    this.gui = gui;
  }
}
/// #endif
