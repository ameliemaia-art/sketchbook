import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import NeutralNetworkSketch, { NeutralNetworkGUI } from "./neural-network";

import "../../global.css";

export default { title: "Sketchbook/Forms/NeuralNetwork" };

export const NeuralNetwork = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | undefined;
    if (rootRef.current && canvasRef.current) {
      pane = new Pane({ title: "Neural Network" });
      const sketch = new NeutralNetworkSketch(
        rootRef.current,
        canvasRef.current,
      );
      new NeutralNetworkGUI(pane, sketch);
    }

    return () => {
      pane?.dispose();
    };
  }, []);

  return (
    <>
      <div className="neural-network" ref={rootRef}>
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};
