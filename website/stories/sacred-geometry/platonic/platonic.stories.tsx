import { useEffect, useRef } from "react";

import PlatonicSketch, { GUIPlatonic } from "./platonic";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Platonic",
};

export const Platonic = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new PlatonicSketch(rootRef.current);
      new GUIPlatonic(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
