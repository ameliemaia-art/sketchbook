import paper from "paper";
import { MathUtils } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";

export type Torus = {
  divisions: number;
  scaleX: number;
};

export function torus(
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: Torus,
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
export class GUITorus extends GUIController {
  constructor(
    gui: GUIType,
    public target: Torus,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Torus" });

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
