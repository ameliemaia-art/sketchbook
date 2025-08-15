import paper from "paper";
import { MathUtils } from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";

export type Scotia = {
  divisions: number;
  baseBottomLength: number;
  baseTopLength: number;
  baseHeight: number;
};

export function scotia(
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: Scotia,
) {
  const points: paper.Point[] = [];
  points.push(new paper.Point(0, size.height)); // Start at the top
  points.push(
    new paper.Point(size.width * settings.baseBottomLength, size.height),
  );

  // Moves up a bit
  points.push(
    new paper.Point(
      size.width * settings.baseBottomLength,
      size.height - size.height * settings.baseHeight,
    ),
  );

  points.push(
    new paper.Point(
      size.width * settings.baseTopLength,
      size.height * settings.baseHeight,
    ),
  );
  points.push(new paper.Point(size.width * settings.baseTopLength, 0));
  points.push(new paper.Point(0, 0)); // Start at the top

  // const arcCenter = new paper.Point()

  // for (let i = 0; i < settings.divisions; i++) {
  //   const t = i / (settings.divisions - 1);
  //   const theta = MathUtils.lerp(-90, 90, t);
  //   const x = arcCenter.x * Math.cos(MathUtils.degToRad(theta));
  //   const y = arcCenter.y + radius * Math.sin(MathUtils.degToRad(theta));
  //   const point = new paper.Point(x, y);
  //   points.push(point);
  // }
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
      .addBinding(target, "baseTopLength", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "baseBottomLength", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "baseHeight", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "divisions", { min: 0 })
      .on("change", this.onChange);
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
