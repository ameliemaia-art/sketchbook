import paper from "paper";
import { MathUtils } from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";

export type ScotiaPath = {
  divisions: number;
  bottomLength: number;
  topLength: number;
  bottomHeight: number;
  topHeight: number;
};

export function scotiaPath(
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: ScotiaPath,
) {
  // Bottom left
  const p0 = new paper.Point(0, size.height);
  // Bottom left end
  const p1 = new paper.Point(size.width * settings.bottomLength, size.height);
  // Move up
  const p2 = new paper.Point(
    size.width * settings.bottomLength,
    size.height - size.height * settings.bottomHeight,
  );
  // Top left end
  const p3 = new paper.Point(
    size.width * settings.topLength,
    size.height * settings.topHeight,
  );
  // Top left end top
  const p4 = new paper.Point(size.width * settings.topLength, 0);
  // Top left
  const p5 = new paper.Point(0, 0);

  const points: paper.Point[] = [];
  points.push(p0);
  points.push(p1);
  points.push(p2);

  const arcCenter = new paper.Point(p2.x, p3.y);
  const radiusX = p2.x - p3.x;
  const radiusY = p2.y - p3.y;

  for (let i = 0; i < settings.divisions; i++) {
    const t = i / (settings.divisions - 1);
    const theta = MathUtils.lerp(90, 180, t);
    const x = arcCenter.x + radiusX * Math.cos(MathUtils.degToRad(theta));
    const y = arcCenter.y + radiusY * Math.sin(MathUtils.degToRad(theta));
    const point = new paper.Point(x, y);
    points.push(point);
  }

  points.push(p3);
  points.push(p4);
  points.push(p5);

  return points;
}

/// #if DEBUG
export class GUIScotiaPath extends GUIController {
  constructor(
    gui: GUIType,
    public target: ScotiaPath,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Scotia Path" });

    // Basic dimensions
    this.gui
      .addBinding(target, "topLength", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "topHeight", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "bottomLength", { min: 0 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "bottomHeight", { min: 0 })
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
