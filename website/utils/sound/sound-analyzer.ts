import {
  AudioAnalyser,
  AudioListener,
  AudioLoader,
  EventDispatcher,
  Audio as ThreeAudio,
} from "three";

import GUIController from "@utils/gui/gui";
import { GUIType } from "@utils/gui/gui-types";
import FrequencyModel, { GUIFrequencyModel } from "./frequency-model";

export type SoundData = {
  amplitude: number;
  fft: Uint8Array | null;
};

class SoundAnalyzer extends EventDispatcher {
  audio?: ThreeAudio;
  htmlAudio?: HTMLAudioElement;
  analyser?: AudioAnalyser;
  analyzers: { [key: string]: AudioAnalyser } = {};

  progress = 0;
  time = "00:00";
  binSize = 0;
  seek = 0;
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
    this.snareModel.threshold = 0.8;
    this.snareModel.range.min = 3000;
    this.snareModel.range.max = 4000;

    this.beatModel = new FrequencyModel("beat");
    this.beatModel.threshold = 0.8;
    this.beatModel.range.min = 2800;
    this.beatModel.range.max = 12000;
  }

  async loadAndPlayAudio(fileUrl: string) {
    // Create an HTML5 audio element and load the file
    this.htmlAudio = new Audio(fileUrl);
    this.htmlAudio.crossOrigin = "anonymous"; // Enable CORS if needed
    this.htmlAudio.controls = true;

    const onLoaded = () => {
      if (!this.htmlAudio) return;

      // Create a Three.js Audio instance and link it with the HTML5 audio
      const context = this.listener.context;
      const source = context.createMediaElementSource(this.htmlAudio);

      // Create the Three.js Audio object using the context and source
      this.audio = new ThreeAudio(this.listener);
      // @ts-ignore
      this.audio.setNodeSource(source);

      this.setSound(this.audio);
    };

    this.htmlAudio.addEventListener("canplaythrough", onLoaded);

    this.htmlAudio.load(); // Wait for audio to load if needed
    // Object.assign(this.htmlAudio.style, {
    //   position: "absolute",
    //   top: "0",
    //   left: "0",
    //   zIndex: "100",
    // });
    // document.body.appendChild(this.htmlAudio);
  }

  play = () => {
    if (this.htmlAudio) this.htmlAudio.play();
  };

  pause = () => {
    if (this.htmlAudio) this.htmlAudio.pause();
  };

  setSound(audio: ThreeAudio) {
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

    if (this.analyser && this.htmlAudio && this.audio) {
      this.data.fft = this.analyser.getFrequencyData();
      this.data.amplitude = this.analyser.getAverageFrequency() / 255;

      this.time = `${this.formatTime(this.htmlAudio.currentTime)} / ${this.formatTime(this.htmlAudio.duration)}`;

      if (this.htmlAudio) {
        this.progress = this.htmlAudio.currentTime / this.htmlAudio.duration;
      } else {
        this.progress = 0;
      }

      this.kickModel.update(this.data.fft, this.binSize);
      this.snareModel.update(this.data.fft, this.binSize);
      this.beatModel.update(this.data.fft, this.binSize);
    }
  }

  // Helper function to format time in hh:mm:ss
  formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const formattedHrs = hrs > 0 ? `${hrs.toString().padStart(2, "0")}:` : "";
    const formattedMins = `${mins.toString().padStart(2, "0")}:`;
    const formattedSecs = secs.toString().padStart(2, "0");

    return `${formattedHrs}${formattedMins}${formattedSecs}`;
  }

  get isPlaying() {
    return this.htmlAudio ? !this.htmlAudio.paused : false;
  }

  onSeek = () => {
    if (!this.htmlAudio) return;
    this.htmlAudio.currentTime = this.seek * this.htmlAudio.duration;
  };
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
    this.gui
      .addBinding(target, "seek", { min: 0, max: 1 })
      .on("change", target.onSeek);

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
