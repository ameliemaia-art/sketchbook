import { useEffect, useRef } from "react";

import FlowerOfLifeSketch, { GUIFlowerOfLife } from "./flower-of-life";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Sacred/Flower Of Life",
};

export const FlowerOfLife = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new FlowerOfLifeSketch(rootRef.current);
      new GUIFlowerOfLife(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
