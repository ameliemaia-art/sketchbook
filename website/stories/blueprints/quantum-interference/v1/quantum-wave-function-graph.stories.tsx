import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import GraphSketch, {
  GUIQuantumWaveFunctionGraph,
} from "./quantum-wave-function-graph";

export default {
  title: "Sketchbook/Blueprints/Quantum/Interference/Wave Function Graph",
};

export const WaveFunctionGraph = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current && canvasRef.current) {
      const pane = new Pane({ title: "Graph" });
      const sketch = new GraphSketch(rootRef.current, canvasRef.current);
      new GUIQuantumWaveFunctionGraph(pane, sketch);
    }

    return () => {};
  }, []);

  return (
    <div className="sketch">
      <div ref={rootRef}>
        <canvas ref={canvasRef} />;
      </div>
    </div>
  );
};
