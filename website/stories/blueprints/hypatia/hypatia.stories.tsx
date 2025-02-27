import { useEffect, useRef } from "react";

import EggOfLifeSketch, { GUIHypatia } from "./hypatia";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Human/Hypatia",
};

export const Hypatia = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Human" });
    if (rootRef.current) {
      const sacred = new EggOfLifeSketch(rootRef.current);
      new GUIHypatia(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
