import { MathUtils } from "three";

import { TWO_PI } from "@utils/three/math";

export type QuantumInterferenceSettings = {
  blueprint: {
    darkness: boolean;
  };
  form: {
    emitters: number;
    waves: number;
    enableJitter: boolean;
    jitter: number;
    opacity: number;
    waveThickness: number;
    pointsPerPositionOnWave: number;
    waveJitter: number;
    particleSize: { x: number; y: number };
  };
};

export function quantumWaveCanvas(
  ctx: CanvasRenderingContext2D,
  center: { x: number; y: number },
  radius: number,
  settings: QuantumInterferenceSettings,
) {
  for (let i = 0; i < settings.form.waves; i++) {
    const r = MathUtils.lerp(
      radius * 0.1,
      radius,
      i / (settings.form.waves - 1),
    );

    // Distribute points along the circle
    const numPoints = Math.round(r * 2);
    for (let j = 0; j < numPoints; j++) {
      for (let k = 0; k < settings.form.pointsPerPositionOnWave; k++) {
        // Jitter the points slightly
        let angle = (j / numPoints) * Math.PI * 2;
        // Offset angle with jitter
        if (settings.form.enableJitter) {
          const jitter = MathUtils.randFloatSpread(settings.form.jitter);
          angle += jitter;
        }

        let randomD = Math.random();

        // Random radius within the wave thickness
        let r2 = MathUtils.lerp(
          r - settings.form.waveThickness / 2,
          r + settings.form.waveThickness / 2,
          randomD,
        );

        let x = center.x + r2 * Math.cos(angle);
        let y = center.y + r2 * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(
          x,
          y,
          MathUtils.randFloat(
            settings.form.particleSize.x,
            settings.form.particleSize.y,
          ),
          0,
          Math.PI,
        );

        let opacity =
          MathUtils.clamp(
            Math.pow(1.0 - Math.abs(randomD - 0.5) / 0.5, 2),
            0,
            1,
          ) * settings.form.opacity;

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
    }
  }
}
