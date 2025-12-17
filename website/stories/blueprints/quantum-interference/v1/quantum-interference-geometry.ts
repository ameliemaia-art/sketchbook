import { MathUtils } from "three";

import { TWO_PI } from "@utils/three/math";

export type QuantumInterferenceSettings = {
  blueprint: {
    darkness: boolean;
  };
  form: {
    emitters: number;
    waves: number;
    jitter: number;
    jitterEnabled: boolean;
    power: number;
  };
};

export function quantumWaveCanvas(
  ctx: CanvasRenderingContext2D,
  center: { x: number; y: number },
  radius: number,
  settings: QuantumInterferenceSettings,
) {}
