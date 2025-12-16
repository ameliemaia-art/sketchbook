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
) {}
