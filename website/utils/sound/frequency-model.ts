import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";

export default class FrequencyModel {
  range = {
    min: 0,
    max: 1,
  };

  threshold = 0.5;
  indices = { start: 0, end: 0 };
  fftSlice?: Uint8Array | null;

  amplitude = 0;
  prevAmplitude = 0;

  detected = false;

  constructor(public id: string) {}

  update(fft: Uint8Array, binSize: number) {
    this.indices.start = Math.floor(this.range.min / binSize);
    this.indices.end = Math.ceil(this.range.max / binSize);

    this.amplitude = this.calculateAverageAmplitude(
      fft,
      this.indices.start,
      this.indices.end,
    );

    this.fftSlice = fft.slice(this.indices.start, this.indices.end);

    if (this.amplitude >= this.threshold) {
      if (!this.detected) {
        this.detected = true;
      }
    } else {
      this.detected = false;
    }
    this.prevAmplitude = this.amplitude;
  }

  calculateAverageAmplitude(
    frequencyData: Uint8Array,
    startIndex: number,
    endIndex: number,
  ) {
    let sum = 0;
    for (let i = startIndex; i < endIndex; i++) {
      sum += frequencyData[i];
    }
    return sum / (endIndex - startIndex) / 255;
  }
}

/// #if DEBUG
export class GUIFrequencyModel extends GUIController {
  constructor(gui: GUIType, target: FrequencyModel) {
    super(gui);
    this.gui = this.addFolder(gui, { title: `${target.id}` });

    this.gui.addBinding(target, "threshold", { min: 0, max: 1 });

    this.gui.addBinding(target.range, "min", {
      min: 0,
      max: 20000,
      label: "Frequency min (hz)",
    });
    this.gui.addBinding(target.range, "max", {
      min: 0,
      max: 20000,
      label: "Frequency max (hz)",
    });
    this.gui.addBinding(target, "amplitude", {
      min: 0,
      max: 1,
      readonly: true,
    });
  }
}
/// #endif
