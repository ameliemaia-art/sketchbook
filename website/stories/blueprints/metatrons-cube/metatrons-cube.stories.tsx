import { useEffect, useRef } from "react";

import MetatronsCubeSketch, { GUIMetatronsCube } from "./metatrons-cube";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Sacred/Metatrons Cube",
};

export const MetatronsCube = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new MetatronsCubeSketch(rootRef.current);
      new GUIMetatronsCube(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
