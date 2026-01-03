import { MathUtils } from "three";

import { TWO_PI } from "@utils/three/math";

export type QuantumWavesSettings = {
  scale: number;
  seed: number;
  renderSteps: number;
  accumulate: boolean;
  blueprint: {
    darkness: boolean;
  };
  form: {
    // Light sources
    lights: {
      startAngle: number;
      count: number;
      rays: number;
      offset: number;
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
      opacity: number;
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
  settings: QuantumWavesSettings,
) {}
