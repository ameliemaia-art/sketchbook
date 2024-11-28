import { useEffect, useRef } from "react";

import FruitOfLifeSketch, { GUIFruitOfLife } from "./fruit-of-life";

import "../../global.css";
import "./fruit-of-life.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Fruit Of Life",
};

export const FruitOfLife = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const sacred = new FruitOfLifeSketch(rootRef.current);
      new GUIFruitOfLife(new Pane({ title: "Sacred Geometry" }), sacred);
    }

    return () => {};
  }, []);

  return <canvas ref={rootRef} />;
};
