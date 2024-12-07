import { useEffect, useRef } from "react";

import GermOfLifeSketch, { GUIGermOfLife } from "./germ-of-life";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Germ Of Life",
};

export const GermOfLife = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new GermOfLifeSketch(rootRef.current);
      new GUIGermOfLife(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
