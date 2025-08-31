import paper from "paper";
import { CatmullRomCurve3, MathUtils, Vector3 } from "three";

import { saveJsonFile } from "@utils/common/file";
import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import { lerp } from "@utils/paper/utils";

export type AcanthusFront = {
  width: number;
  height: number;
  arcStart: number;
  divisions: number;
};

export function acanthusFront(
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: AcanthusFront,
) {
  const points: paper.Point[] = [];

  const width = settings.width * size.width;
  const startX = size.width / 2 - width / 2;
  const endX = size.width / 2 + width / 2;

  const p0 = new paper.Point(startX, size.height);

  const lineHeight = settings.height * size.height;
  const p1 = new paper.Point(startX, size.height - lineHeight);
  const p2 = new paper.Point(endX, size.height - lineHeight);
  const p3 = new paper.Point(endX, size.height);

  const arcStart = lerp(p0, p1, settings.arcStart);
  const arcEnd = lerp(p1, p2, 0.5);
  const arcCenter = new paper.Point(arcEnd.x, arcStart.y);

  const radiusX = arcEnd.x - arcStart.x;
  const radiusY = arcEnd.y - arcStart.y;

  points.push(p0);

  for (let i = 0; i < settings.divisions; i++) {
    const t = i / (settings.divisions - 1);
    const theta = MathUtils.lerp(180, 0, t);
    const x = arcCenter.x + radiusX * Math.cos(MathUtils.degToRad(theta));
    const y = arcCenter.y + radiusY * Math.sin(MathUtils.degToRad(theta));
    const point = new paper.Point(x, y);
    points.push(point);
  }

  points.push(p3);
  points.push(p0);

  return points;
}

/// #if DEBUG
export class GUIAcanthusFront extends GUIController {
  constructor(
    gui: GUIType,
    public target: AcanthusFront,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Acanthus Front" });

    this.gui
      .addBinding(target, "width", { min: 0, max: 1 })
      .on("change", this.onChange);

    this.gui
      .addBinding(target, "height", { min: 0, max: 1 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "arcStart", { min: 0, max: 1 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "divisions", { min: 10, step: 1 })
      .on("change", this.onChange);

    this.gui.addButton({ title: "Save" }).on("click", () => {
      saveJsonFile(JSON.stringify(target), "acanthus");
    });
  }

  onChange = () => {
    this.dispatchEvent({ type: "change" } as never);
  };
}
/// #endif
