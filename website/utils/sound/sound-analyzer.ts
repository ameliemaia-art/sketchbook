import {
  Audio,
  AudioAnalyser,
  AudioListener,
  AudioLoader,
  EventDispatcher,
} from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";

export type SoundData = {
  frequencies: {
    beat: number;
    kick: number;
    snare: number;
    amplitude: number;
  };
  indices: {
    beat: {
      start: number;
      end: number;
    };
    kick: {
      start: number;
      end: number;
    };
    snare: {
      start: number;
      end: number;
    };
  };
  frequencyData: Uint8Array | null;
};

class SoundAnalyzer extends EventDispatcher {
  audio?: Audio;
  analyser?: AudioAnalyser;
  analyzers: { [key: string]: AudioAnalyser } = {};

  progress = 0;
  time = 0;
  binSize = 0;
  started = false;
  lastBeatAmplitude = 0;
  lastKickAmplitude = 0;
  lastSnareAmplitude = 0;

  data: SoundData = {
    frequencies: {
      beat: 0,
      kick: 0,
      snare: 0,
      amplitude: 0,
    },
    indices: {
      beat: { start: 0, end: 0 },
      kick: { start: 0, end: 0 },
      snare: { start: 0, end: 0 },
    },
    frequencyData: null,
  };

  // Frequency ranges
  kickFreqRange = { min: 100.0, max: 300 };
  snareFreqRange = { min: 250, max: 4000 };
  beatFreqRange = { min: 4000, max: 20000 };

  listener = new AudioListener();
  loader = new AudioLoader();

  beatThreshold = 0.3;
  kickThreshold = 0.97;
  snareThreshold = 0.5;

  beatDetected = false;
  kickDetected = false;
  snareDetected = false;

  async loadAndPlayAudio(fileUrl: string) {
    const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
      this.loader.load(fileUrl, resolve, undefined, reject);
    });
    this.audio = new Audio(this.listener);
    this.audio.setBuffer(audioBuffer);
    this.setSound(this.audio);
  }

  play = () => {
    if (this.audio) this.audio.play();
  };

  pause = () => {
    if (this.audio) this.audio.pause();
  };

  setSound(audio: Audio) {
    this.audio = audio;
    if (!this.analyzers[audio.uuid]) {
      this.analyzers[audio.uuid] = new AudioAnalyser(audio, 512);
    }
    this.binSize =
      this.analyzers[audio.uuid].analyser.context.sampleRate / //
      this.analyzers[audio.uuid].analyser.fftSize;
    this.analyser = this.analyzers[audio.uuid];
  }

  update() {
    if (!this.isPlaying) return;

    if (this.analyser && this.audio) {
      this.data.frequencyData = this.analyser.getFrequencyData();
      this.data.frequencies.amplitude =
        this.analyser.getAverageFrequency() / 255;

      this.data.indices.beat.start = Math.floor(
        this.beatFreqRange.min / this.binSize,
      );
      this.data.indices.beat.end = Math.ceil(
        this.beatFreqRange.max / this.binSize,
      );

      this.data.indices.kick.start = Math.floor(
        this.kickFreqRange.min / this.binSize,
      );
      this.data.indices.kick.end = Math.ceil(
        this.kickFreqRange.max / this.binSize,
      );

      this.data.indices.snare.start = Math.floor(
        this.snareFreqRange.min / this.binSize,
      );
      this.data.indices.snare.end = Math.ceil(
        this.snareFreqRange.max / this.binSize,
      );

      this.updateFrequencyRanges();

      // Detect audio elements
      this.detectBeat();
      this.detectKick();
      this.detectSnare();
    }
  }

  updateFrequencyRanges() {
    if (!this.data.frequencyData) return;

    this.data.frequencies.beat = this.calculateAverageAmplitude(
      this.data.frequencyData,
      this.data.indices.beat.start,
      this.data.indices.beat.end,
    );

    this.data.frequencies.kick = this.calculateAverageAmplitude(
      this.data.frequencyData,
      this.data.indices.kick.start,
      this.data.indices.kick.end,
    );

    this.data.frequencies.snare = this.calculateAverageAmplitude(
      this.data.frequencyData,
      this.data.indices.snare.start,
      this.data.indices.snare.end,
    );
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

  detectBeat() {
    if (
      this.data.frequencies.amplitude > this.beatThreshold &&
      this.data.frequencies.amplitude > this.lastBeatAmplitude
    ) {
      if (!this.beatDetected) {
        this.beatDetected = true;
      }
    } else {
      this.beatDetected = false;
    }
    this.lastBeatAmplitude = this.data.frequencies.amplitude;
  }

  detectKick() {
    if (
      this.data.frequencies.kick > this.kickThreshold
      // this.data.frequencies.low > this.lastLowAmplitude
    ) {
      if (!this.kickDetected) {
        this.kickDetected = true;
      }
    } else {
      this.kickDetected = false;
    }
    this.lastKickAmplitude = this.data.frequencies.kick;
  }

  detectSnare() {
    if (
      this.data.frequencies.snare > this.snareThreshold &&
      this.data.frequencies.snare > this.lastSnareAmplitude
    ) {
      if (!this.snareDetected) {
        this.snareDetected = true;
      }
    } else {
      this.snareDetected = false;
    }
    this.lastSnareAmplitude = this.data.frequencies.snare;
  }

  get isPlaying() {
    return this.audio ? this.audio.isPlaying : false;
  }
}

const soundAnalyzer = new SoundAnalyzer();
export default soundAnalyzer;

/// #if DEBUG
export class GUISoundAnalyzer extends GUIController {
  constructor(gui: GUIType, target: SoundAnalyzer) {
    super(gui);
    this.gui = this.addFolder(gui, { title: "SoundAnalyzer" });

    this.gui.addButton({ title: "Play", label: "" }).on("click", target.play);
    this.gui.addButton({ title: "Pause", label: "" }).on("click", target.pause);

    this.gui.addBinding(target, "time", { readonly: true });
    this.gui.addBinding(target, "progress", { min: 0, max: 1, readonly: true });
    this.gui.addBinding(target, "beatThreshold", { min: 0, max: 1 });
    this.gui.addBinding(target, "kickThreshold", { min: 0, max: 1 });
    this.gui.addBinding(target, "snareThreshold", { min: 0, max: 1 });

    this.gui.addBinding(target.beatFreqRange, "min", {
      min: 0,
      max: 20000,
      label: "Beat freq min",
    });
    this.gui.addBinding(target.beatFreqRange, "max", {
      min: 0,
      max: 20000,
      label: "Beat freq max",
    });
    this.gui.addBinding(target.kickFreqRange, "min", {
      min: 0,
      max: 20000,
      label: "Kick freq min",
    });
    this.gui.addBinding(target.kickFreqRange, "max", {
      min: 0,
      max: 20000,
      label: "Kick freq max",
    });
    this.gui.addBinding(target.snareFreqRange, "min", {
      min: 0,
      max: 20000,
      label: "Snare freq min",
    });
    this.gui.addBinding(target.snareFreqRange, "max", {
      min: 0,
      max: 20000,
      label: "Snare freq max",
    });
    this.gui.addBinding(target.data.frequencies, "amplitude", {
      min: 0,
      max: 1,
      readonly: true,
    });

    this.gui.addBinding(target.data.frequencies, "beat", {
      readonly: true,
      // view: "graph",
      // min: 0,
      // max: 1,
    });
    this.gui.addBinding(target.data.frequencies, "kick", {
      readonly: true,
      // view: "graph",
      // min: 0,
      // max: 1,
    });
    this.gui.addBinding(target.data.frequencies, "snare", {
      readonly: true,
      // view: "graph",
      // min: 0,
      // max: 1,
    });
    this.gui.addBinding(target.data.frequencies, "amplitude", {
      readonly: true,
      view: "graph",
      min: 0,
      max: 1,
    });
  }
}
/// #endif
