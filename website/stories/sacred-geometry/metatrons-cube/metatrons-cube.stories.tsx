import { useEffect, useRef } from "react";

import MetatronsCubeSketch, { GUIMetatronsCube } from "./metatrons-cube";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Metatrons Cube",
};

export const MetatronsCube = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new MetatronsCubeSketch(rootRef.current);
      new GUIMetatronsCube(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
