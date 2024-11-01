import {
  Audio,
  AudioAnalyser,
  AudioListener,
  AudioLoader,
  EventDispatcher,
} from "three";
import { threshold } from "three/webgpu";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import FrequencyModel, { GUIFrequencyModel } from "./frequency-model";

export type SoundData = {
  amplitude: number;
  fft: Uint8Array | null;
};

class SoundAnalyzer extends EventDispatcher {
  audio?: Audio;
  analyser?: AudioAnalyser;
  analyzers: { [key: string]: AudioAnalyser } = {};

  progress = 0;
  time = 0;
  binSize = 0;
  started = false;

  data: SoundData = {
    amplitude: 0,
    fft: null,
  };

  listener = new AudioListener();
  loader = new AudioLoader();

  kickModel: FrequencyModel;
  snareModel: FrequencyModel;
  beatModel: FrequencyModel;

  constructor() {
    super();
    this.kickModel = new FrequencyModel("kick");
    this.kickModel.threshold = 0.97;
    this.kickModel.range.min = 300;
    this.kickModel.range.max = 500;

    this.snareModel = new FrequencyModel("snare");
    this.snareModel.threshold = 0.85;
    this.snareModel.range.min = 1000;
    this.snareModel.range.max = 4000;

    this.beatModel = new FrequencyModel("beat");
    this.beatModel.threshold = 0.8;
    this.beatModel.range.min = 2800;
    this.beatModel.range.max = 12000;
  }

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
      this.data.fft = this.analyser.getFrequencyData();
      this.data.amplitude = this.analyser.getAverageFrequency() / 255;

      this.kickModel.update(this.data.fft, this.binSize);
      this.snareModel.update(this.data.fft, this.binSize);
      this.beatModel.update(this.data.fft, this.binSize);
    }
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

    this.controllers.kick = new GUIFrequencyModel(this.gui, target.kickModel);
    this.controllers.snare = new GUIFrequencyModel(this.gui, target.snareModel);
    this.controllers.beat = new GUIFrequencyModel(this.gui, target.beatModel);
  }
}
/// #endif

// detectBeat() {
//   if (
//     this.data.frequencies.amplitude >= this.beatSettings.threshold &&
//     this.data.frequencies.amplitude > this.data.frequencies.prev.amplitude
//   ) {
//     if (!this.beatDetected) {
//       this.beatDetected = true;
//     }
//   } else {
//     this.beatDetected = false;
//   }
//   this.data.frequencies.prev.amplitude = this.data.frequencies.amplitude;
// }

// detectSnare() {
//   if (
//     this.data.frequencies.snare >= this.snareSettings.threshold &&
//     this.data.frequencies.snare > this.data.frequencies.prev.snare
//   ) {
//     if (!this.snareDetected) {
//       this.snareDetected = true;
//     }
//   } else {
//     this.snareDetected = false;
//   }
//   this.data.frequencies.prev.snare = this.data.frequencies.snare;
// }
