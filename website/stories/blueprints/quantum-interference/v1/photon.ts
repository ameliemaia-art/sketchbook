import { Box2, MathUtils, Vector2 } from "three";

import { TWO_PI } from "@utils/three/math";
import Ray from "./ray";

export default class Photon {
  t = 0;
  speed = 1;

  origin = new Vector2();
  position = new Vector2();
  finalPosiiton = new Vector2();
  direction = new Vector2();
  destination = new Vector2();
  tangent = new Vector2();

  p0 = new Vector2();
  p1 = new Vector2();

  wavePhase = 0;
  phase = 0;

  ray: Ray;
  needsRecalculation = true;
  cachedDestination = new Vector2();

  constructor(
    public ctx: CanvasRenderingContext2D,
    public size: Vector2,
  ) {
    this.ray = new Ray(this.origin, this.direction, this.size);
  }

  setOrigin(x: number, y: number) {
    this.origin.set(x, y);
    this.needsRecalculation = true;
  }

  setDirection(x: number, y: number) {
    this.direction.set(x, y);
    this.direction.normalize();
    this.needsRecalculation = true;
  }

  setPhase(phase: number) {
    this.phase = phase;
  }

  drawRay() {
    this.ctx.lineWidth = 1;

    // Draw origin circle
    this.ctx.beginPath();
    this.ctx.arc(this.origin.x, this.origin.y, 2, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    this.ctx.fill();
    this.ctx.closePath();

    // Draw ray line
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.beginPath();
    this.ctx.moveTo(this.origin.x, this.origin.y);
    this.ctx.lineTo(this.destination.x, this.destination.y);
    this.ctx.setLineDash([2.5, 2.5]);
    this.ctx.stroke();
    this.ctx.closePath();

    // Draw destination circle
    this.ctx.beginPath();
    this.ctx.arc(this.destination.x, this.destination.y, 2, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
    this.ctx.fill();
    this.ctx.closePath();
  }

  waveFunction(position: Vector2) {
    position.x = MathUtils.lerp(
      this.origin.x,
      this.cachedDestination.x,
      this.t,
    );
    position.y = MathUtils.lerp(
      this.origin.y,
      this.cachedDestination.y,
      this.t,
    );

    // Calculate tangent perpendicular to the direction (rotate 90 degrees)
    this.tangent.set(-this.direction.y, this.direction.x);

    // Draw tangent line centered at current photon position
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    const lineLength = 5;

    this.p0.set(
      this.position.x + this.tangent.x * -lineLength,
      this.position.y + this.tangent.y * -lineLength,
    );
    this.p1.set(
      this.position.x + this.tangent.x * lineLength,
      this.position.y + this.tangent.y * lineLength,
    );

    // this.ctx.beginPath();
    // this.ctx.moveTo(this.p0.x, this.p0.y);
    // this.ctx.lineTo(this.p1.x, this.p1.y);
    // this.ctx.setLineDash([2.5, 2.5]);
    // this.ctx.stroke();
    // this.ctx.closePath();

    position.lerpVectors(
      this.p0,
      this.p1,
      Math.sin(this.wavePhase) * 0.5 + 0.5,
    );
  }

  drawPhoton() {
    // Photon moves along the direction of the ray, with the wave motion from the wave function

    const lineDistance = Math.abs(
      this.origin.distanceTo(this.cachedDestination),
    );
    const steps = Math.round(lineDistance / 2);

    for (let i = 0; i < steps; i++) {
      this.t = i / (steps - 1);
      this.wavePhase = this.t * TWO_PI * 3;
      this.waveFunction(this.position);

      const waveOpacity = Math.sin(this.phase + this.wavePhase) * 0.5 + 0.5;

      this.ctx.beginPath();
      this.ctx.arc(this.position.x, this.position.y, 1, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${waveOpacity})`;
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  draw() {
    // this.drawRay();

    // Calculate destination once and cache it
    if (this.needsRecalculation) {
      this.cachedDestination = this.ray.intersectRayWithBounds(
        this.origin,
        this.direction,
      );
      this.needsRecalculation = false;
    }

    this.destination.copy(this.cachedDestination);

    this.drawPhoton();
  }
}
