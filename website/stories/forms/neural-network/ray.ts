import { MathUtils, Vector2 } from "three";
import { FolderApi } from "tweakpane";

import GUIController from "@utils/editor/gui/gui";

export default class Ray {
  t = 0.5;
  position = new Vector2();
  settings = {
    boxSize: 10,
  };

  p0 = new Vector2();
  p1 = new Vector2();

  angle = 0.5;

  constructor(
    public v0: Vector2,
    public v1: Vector2,
  ) {}

  draw(ctx: CanvasRenderingContext2D, size: Vector2) {
    this.p0.set(this.v0.x * size.x, this.v0.y * size.y);
    this.p1.set(this.v1.x * size.x, this.v1.y * size.y);

    this.position.lerpVectors(this.p0, this.p1, this.t);
    const halfSize = this.settings.boxSize / 2;

    // Draw square for ray position
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      this.position.x - halfSize,
      this.position.y - halfSize,
      this.settings.boxSize,
      this.settings.boxSize,
    );

    // Draw a line for the ray should be perpendicular to the edge
    const edgeAngle = Math.atan2(this.p1.y - this.p0.y, this.p1.x - this.p0.x);
    const angleOffset = MathUtils.lerp(0, Math.PI, this.angle);
    const renderAngle = edgeAngle + angleOffset;

    const lineLength = size.length() * 1;
    const lineX = this.position.x + Math.cos(renderAngle) * lineLength;
    const lineY = this.position.y + Math.sin(renderAngle) * lineLength;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineDashOffset = 0;
    ctx.setLineDash([5, 10]); // Fixed 5px dash, 5px gap
    ctx.lineTo(lineX, lineY);
    ctx.stroke();
    ctx.restore();
  }
}

export class GUIRay extends GUIController {
  gui: FolderApi;

  constructor(
    gui: FolderApi,
    public target: Ray,
    title = "Ray",
    onUpdate?: () => void,
  ) {
    super(gui);
    this.gui = this.addFolder(gui, { title });

    this.gui.addBinding(target, "t", { min: 0, max: 1 }).on("change", () => {
      onUpdate?.();
    });
    this.gui
      .addBinding(target, "angle", { min: 0, max: 1 })
      .on("change", () => {
        onUpdate?.();
      });
  }
}
