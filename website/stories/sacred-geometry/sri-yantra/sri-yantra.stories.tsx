import { useEffect, useRef } from "react";

import SriYantraSketch, { GUISriYantra } from "./sri-yantra";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Sri Yantra",
};

export const SriYantra = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new SriYantraSketch(rootRef.current);
      new GUISriYantra(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
