import { MathUtils } from "three";

import { TWO_PI } from "@utils/three/math";

export type QuantumInterferenceSettings = {
  scale: number;
  blueprint: {
    darkness: boolean;
  };
  form: {
    // Light sources
    lights: {
      startAngle: number;
      count: number;
      rays: number;
    };
    waves: {
      // How many waves appear
      count: number;
      // Wave banding
      power: number;
      phase: number;
    };
    photon: {
      // Photon
      radius: number;
      density: number;
    };
    quantum: {
      waveFunctionHeight: number;
      waveLength: number;
    };
  };
};

export function quantumWaveCanvas(
  ctx: CanvasRenderingContext2D,
  center: { x: number; y: number },
  radius: number,
  settings: QuantumInterferenceSettings,
) {}
