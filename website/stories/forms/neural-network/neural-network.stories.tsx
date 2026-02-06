import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import NeutralNetworkSketch, { NeutralNetworkGUI } from "./neural-network";

import "../../global.css";

export default { title: "Sketchbook/Forms/NeuralNetwork" };

export const NeuralNetwork = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current && canvasRef.current) {
      const sketch = new NeutralNetworkSketch(
        rootRef.current,
        canvasRef.current,
      );
      new NeutralNetworkGUI(new Pane({ title: "Neural Network" }), sketch);
    }

    return () => {};
  }, []);

  return (
    <>
      <div className="neural-network" ref={rootRef}>
        <canvas ref={canvasRef} />;
      </div>
    </>
  );
};
