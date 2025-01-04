import { useEffect, useRef } from "react";

import EggOfLifeSketch, { GUIEggOfLife } from "./egg-of-life";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Egg Of Life",
};

export const EggOfLife = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new EggOfLifeSketch(rootRef.current);
      new GUIEggOfLife(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
