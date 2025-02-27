import { useEffect, useRef } from "react";

import GermOfLifeSketch, { GUIGermOfLife } from "./germ-of-life";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Sacred/Germ Of Life",
};

export const GermOfLife = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new GermOfLifeSketch(rootRef.current);
      new GUIGermOfLife(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
