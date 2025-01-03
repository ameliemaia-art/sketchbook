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
    if (rootRef.current) {
      const sacred = new PlatonicSketch(rootRef.current);
      new GUIPlatonic(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
