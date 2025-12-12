import paper from "paper";
import { MathUtils } from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";

export type TorusPath = {
  divisions: number;
  scaleX: number;
};

export function torusPath(
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: TorusPath,
) {
  const points: paper.Point[] = [];
  for (let i = 0; i < settings.divisions; i++) {
    const t = i / (settings.divisions - 1);
    const theta = MathUtils.lerp(-90, 90, t);
    const x = radius * settings.scaleX * Math.cos(MathUtils.degToRad(theta));
    const y = radius + radius * Math.sin(MathUtils.degToRad(theta));
    const point = new paper.Point(x, y);
    points.push(point);
  }
  return points;
}

/// #if DEBUG
export class GUITorusPath extends GUIController {
  constructor(
    gui: GUIType,
    public target: TorusPath,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Torus Path" });

    // Basic dimensions
    this.gui
      .addBinding(target, "divisions", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "scaleX", { min: 0 })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
