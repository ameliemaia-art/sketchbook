import paper from "paper";
import { CatmullRomCurve3, Vector3 } from "three";

import { saveJsonFile } from "@utils/common/file";
import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";

export type Acanthus = {
  spiralDivisions: number;
  spiralTurns: number;
  smoothness: number;
  cp0: { x: number; y: number };
  cp1: { x: number; y: number };
  cp2: { x: number; y: number };
  cp3: { x: number; y: number };
  cp4: { x: number; y: number };
};

export function acanthus(
  center: paper.Point,
  size: paper.Size,
  radius: number,
  settings: Acanthus,
) {
  let points: paper.Point[] = [];

  const p0 = new paper.Point(
    settings.cp0.x * size.width,
    settings.cp0.y * size.height,
  );
  const p1 = new paper.Point(
    settings.cp1.x * size.width,
    settings.cp1.y * size.height,
  );
  const p2 = new paper.Point(
    settings.cp2.x * size.width,
    settings.cp2.y * size.height,
  );
  const p3 = new paper.Point(
    settings.cp3.x * size.width,
    settings.cp3.y * size.height,
  );
  const p4 = new paper.Point(
    settings.cp4.x * size.width,
    settings.cp4.y * size.height,
  );

  // dot(p0, 5);
  // dot(p1, 5);
  // dot(p2, 5);
  // dot(p3, 5);
  // dot(p4, 5);

  // Create spiral starting from p1 with p2 as center
  const spiralPoints: paper.Point[] = [];
  const spiralCenter = p4;
  const startRadius = p3.getDistance(spiralCenter);

  // Calculate the starting angle based on the vector from spiral center to p1
  const startAngle = Math.atan2(p3.y - spiralCenter.y, p3.x - spiralCenter.x);

  // Generate spiral points
  for (let i = 0; i < settings.spiralDivisions; i++) {
    const t = i / (settings.spiralDivisions - 1);

    // Calculate spiral parameters
    const angle = startAngle + t * settings.spiralTurns * Math.PI * 2; // Start from p1's angle and spiral
    const radius = startRadius * (1 - t * 0.8); // Spiral inward (decrease radius over time)

    // Calculate spiral position
    const x = spiralCenter.x + radius * Math.cos(angle);
    const y = spiralCenter.y + radius * Math.sin(angle);

    spiralPoints.push(new paper.Point(x, y));
  }

  // Combine base points with spiral
  points.push(p0);
  points.push(p1);
  points.push(p2);
  points.push(p3);

  // Add spiral points
  spiralPoints.forEach((point, i) => {
    if (i > 0) {
      points.push(point);
    }
  });

  const points2 = points.map((p) => {
    const { x, y } = p;
    return new Vector3(x, y, 0);
  });

  const spline = new CatmullRomCurve3(points2, false);
  const points3 = spline.getPoints(settings.smoothness);

  return points3.map((p) => {
    const { x, y } = p;
    return new paper.Point(x, y);
  });
}

/// #if DEBUG
export class GUIAcanthusSide extends GUIController {
  constructor(
    gui: GUIType,
    public target: AcanthusSide,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "Acanthus Side" });

    // Basic dimensions
    this.gui
      .addBinding(target, "spiralDivisions", { min: 0, step: 1 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "smoothness", { min: 10, step: 1 })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "spiralTurns", { min: 0 })
      .on("change", this.onChange);

    // Control points
    this.gui
      .addBinding(target, "cp0", {
        x: { min: 0, max: 1 },
        y: { min: 0, max: 1 },
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "cp1", {
        x: { min: 0, max: 1 },
        y: { min: 0, max: 1 },
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "cp2", {
        x: { min: 0, max: 1 },
        y: { min: 0, max: 1 },
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "cp3", {
        x: { min: 0, max: 1 },
        y: { min: 0, max: 1 },
      })
      .on("change", this.onChange);
    this.gui
      .addBinding(target, "cp4", {
        x: { min: 0, max: 1 },
        y: { min: 0, max: 1 },
      })
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
