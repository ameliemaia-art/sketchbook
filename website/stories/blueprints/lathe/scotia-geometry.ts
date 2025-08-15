import paper from "paper";
import { MathUtils } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";

export type Scotia = {
  divisions: number;
};

export function scotia(radius: number, settings: Scotia) {
  const points: paper.Point[] = [];
  for (let i = 0; i < settings.divisions; i++) {
    const t = i / (settings.divisions - 1);
    const theta = MathUtils.lerp(-90, 90, t);
    const x = radius * Math.cos(MathUtils.degToRad(theta));
    const y = radius + radius * Math.sin(MathUtils.degToRad(theta));
    const point = new paper.Point(x, y);
    points.push(point);
  }
  return points;
}

/// #if DEBUG
export class GUIScotia extends GUIController {
  constructor(
    gui: GUIType,
    public target: Scotia,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Scotia" });

    // Basic dimensions
    this.gui
      .addBinding(target, "divisions", { min: 0 })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
