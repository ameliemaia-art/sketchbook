import { useEffect, useRef } from "react";

import FlowerOfLifeSketch, { GUIFlowerOfLife } from "./flower-of-life";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Flower Of Life",
};

export const FlowerOfLife = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new FlowerOfLifeSketch(rootRef.current);
      new GUIFlowerOfLife(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
