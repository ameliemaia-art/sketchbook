import { useEffect, useRef } from "react";

import FruitOfLifeSketch, { GUIFruitOfLife } from "./fruit-of-life";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Sacred/Fruit Of Life",
};

export const FruitOfLife = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pane = new Pane({ title: "Sacred Geometry" });
    if (rootRef.current) {
      const sacred = new FruitOfLifeSketch(rootRef.current);
      new GUIFruitOfLife(pane, sacred);
    }

    return () => {
      pane.dispose();
    };
  }, []);

  return <canvas ref={rootRef} />;
};
