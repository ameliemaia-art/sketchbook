import {
  AudioAnalyser,
  AudioListener,
  AudioLoader,
  EventDispatcher,
  Audio as ThreeAudio,
} from "three";

import GUIController from "@utils/editor/gui/gui";
import { GUIType } from "@utils/editor/gui/gui-types";
import FrequencyModel, { GUIFrequencyModel } from "./frequency-model";

export type SoundData = {
  amplitude: number;
  fft: Uint8Array | null;
};

enum AudioType {
  IOS = "iOS",
  DEFAULT = "default",
}

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
  isLoaded = false;
  isLoading = false;

  data: SoundData = {
    amplitude: 0,
    fft: null,
  };

  listener = new AudioListener();
  loader = new AudioLoader();

  kickModel: FrequencyModel;
  snareModel: FrequencyModel;
  beatModel: FrequencyModel;

  audioType: AudioType = AudioType.DEFAULT;

  get audioContextState() {
    return this.listener.context.state;
  }

  get requiresUserInteraction() {
    return this.listener.context.state === "suspended";
  }

  /**
   * Initialize audio context after user interaction.
   * Call this method in response to user interaction (click, touch, etc.)
   * to ensure audio can play without issues.
   */
  async initialize() {
    if (this.listener.context.state === "suspended") {
      console.log("Initializing audio context...");
      await this.listener.context.resume();
      console.log("Audio context initialized");
    }
  }

  constructor() {
    super();
    this.kickModel = new FrequencyModel("kick");
    this.kickModel.threshold = 0.95;
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
    try {
      this.isLoading = true;
      // Ensure audio context is resumed (required for autoplay policies)
      if (this.listener.context.state === "suspended") {
        console.log("Audio context suspended, attempting to resume...");
        await this.listener.context.resume();
        console.log("Audio context resumed");
      }

      this.audio = new ThreeAudio(this.listener);

      this.audioType = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
        ? AudioType.IOS
        : AudioType.DEFAULT;

      console.log("Audio type:", this.audioType);
      console.log("Audio context state:", this.listener.context.state);

      if (this.audioType === AudioType.IOS) {
        const loader = new AudioLoader();
        return new Promise<void>((resolve, reject) => {
          loader.load(
            fileUrl,
            (buffer) => {
              this.audio!.setBuffer(buffer);
              this.setSound(this.audio!);
              this.isLoaded = true;
              this.isLoading = false;
              console.log("Audio loaded successfully (iOS)");
              console.log("Analyser set up:", !!this.analyser);
              console.log("Audio context state:", this.listener.context.state);
              resolve();
            },
            undefined,
            (error) => {
              this.isLoading = false;
              console.error("Failed to load audio (iOS):", error);
              reject(error);
            },
          );
        });
      } else {
        this.htmlAudio = new Audio(fileUrl);
        this.htmlAudio.addEventListener("loadeddata", () => {
          this.isLoaded = true;
          this.isLoading = false;
          console.log("Audio loaded successfully");
        });
        this.htmlAudio.addEventListener("error", (e) => {
          this.isLoading = false;
          console.error("Audio load error:", e);
        });

        // Don't auto-play immediately, wait for explicit play() call
        this.audio.setMediaElementSource(this.htmlAudio);
        this.setSound(this.audio);
      }
    } catch (error) {
      this.isLoading = false;
      console.error("Error in loadAndPlayAudio:", error);
      throw error;
    }
  }

  /**
   * Smart method that loads audio if not loaded, then plays it
   */
  async loadAndPlay(
    fileUrl: string = "/assets/sounds/klangkuenstler-untergang.mp3",
  ) {
    try {
      await this.initialize();

      if (!this.isLoaded && !this.isLoading) {
        await this.loadAndPlayAudio(fileUrl);
      }

      if (this.isLoaded) {
        await this.play();
      }
    } catch (error) {
      console.error("Error in loadAndPlay:", error);
      throw error;
    }
  }

  play = async () => {
    try {
      // Ensure audio context is resumed before playing
      if (this.listener.context.state === "suspended") {
        console.log("Audio context suspended, attempting to resume...");
        await this.listener.context.resume();
        console.log("Audio context resumed");
      }

      if (this.audioType === AudioType.IOS) {
        if (this.audio) {
          this.audio.play();
          console.log("Playing audio (iOS)");
        }
      } else {
        if (this.htmlAudio) {
          await this.htmlAudio.play();
          console.log("Playing audio");
        }
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      throw error;
    }
  };

  pause = () => {
    if (this.audioType === AudioType.IOS) {
      if (this.audio) this.audio.pause();
    } else {
      if (this.htmlAudio) this.htmlAudio.pause();
    }
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

    if (this.analyser) {
      this.data.fft = this.analyser.getFrequencyData();
      this.data.amplitude = this.analyser.getAverageFrequency() / 255;

      if (this.audioType === AudioType.IOS && this.audio) {
        // For iOS/Three.js Audio, we don't have direct access to currentTime/duration
        // But the FFT data should still be flowing through the analyser
        this.time = "Playing (iOS)";
        this.progress = 0; // Could calculate based on buffer offset if needed
      } else if (this.htmlAudio) {
        this.time = `${this.formatTime(this.htmlAudio.currentTime)} / ${this.formatTime(this.htmlAudio.duration)}`;
        this.progress = this.htmlAudio.currentTime / this.htmlAudio.duration;
      } else {
        this.time = "00:00 / 00:00";
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
    if (this.audioType === AudioType.IOS) {
      return this.audio ? this.audio.isPlaying : false;
    } else {
      return this.htmlAudio ? !this.htmlAudio.paused : false;
    }
  }

  get playButtonLabel() {
    if (this.isLoading) return "Loading...";
    if (!this.isLoaded) return "Load & Play";
    if (this.isPlaying) return "Playing";
    return "Play";
  }

  /**
   * Reset audio state to allow loading new files
   */
  reset() {
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio = undefined;
    }
    if (this.audio) {
      if (this.audio.isPlaying) {
        this.audio.stop();
      }
      this.audio = undefined;
    }
    this.analyser = undefined;
    this.isLoaded = false;
    this.isLoading = false;
    this.progress = 0;
    this.time = "00:00";
    console.log("Audio reset");
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
  private playButton: any;
  private target: SoundAnalyzer;

  constructor(gui: GUIType, target: SoundAnalyzer) {
    super(gui);
    this.target = target;
    this.gui = this.addFolder(gui, { title: "SoundAnalyzer" });

    // Smart play/load button that changes based on state
    this.playButton = this.gui
      .addButton({
        title: "Load & Play",
        label: "",
      })
      .on("click", () => target.loadAndPlay());

    this.gui.addButton({ title: "Pause", label: "" }).on("click", target.pause);
    this.gui.addButton({ title: "Reset", label: "" }).on("click", target.reset);

    this.gui.addBinding(target, "time", { readonly: true });
    this.gui.addBinding(target, "progress", { min: 0, max: 1, readonly: true });
    this.gui
      .addBinding(target, "seek", { min: 0, max: 1 })
      .on("change", target.onSeek);

    this.controllers.kick = new GUIFrequencyModel(this.gui, target.kickModel);
    this.controllers.snare = new GUIFrequencyModel(this.gui, target.snareModel);
    this.controllers.beat = new GUIFrequencyModel(this.gui, target.beatModel);

    // Start updating button label
    this.startButtonLabelUpdate();
  }

  private startButtonLabelUpdate() {
    const updateLabel = () => {
      if (this.playButton && this.playButton.element) {
        const button = this.playButton.element.querySelector("button");
        if (button) {
          button.textContent = this.target.playButtonLabel;
        }
      }
      requestAnimationFrame(updateLabel);
    };
    updateLabel();
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
