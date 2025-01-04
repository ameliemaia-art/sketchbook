import { useEffect, useRef } from "react";

import GermOfLifeSketch, { GUITreeOfLife } from "./tree-of-life";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Tree Of Life",
};

export const TreeOfLife = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new GermOfLifeSketch(rootRef.current);
      new GUITreeOfLife(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
