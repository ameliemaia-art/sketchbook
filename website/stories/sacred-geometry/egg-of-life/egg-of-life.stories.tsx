import { useEffect, useRef } from "react";

import EggOfLifeSketch, { GUIEggOfLife } from "./egg-of-life";

import "../../global.css";
import "./egg-of-life.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Egg Of Life",
};

export const EggOfLife = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new EggOfLifeSketch(rootRef.current);
      new GUIEggOfLife(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
