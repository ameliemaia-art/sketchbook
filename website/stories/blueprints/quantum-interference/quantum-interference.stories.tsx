import { useEffect, useRef } from "react";

import QuantumInterferenceSketch, {
  GUIQuantumInterference,
} from "./quantum-interference";

import "../../global.css";

import { Pane } from "tweakpane";

export default {
  title: "Sketchbook/Blueprints/Quantum/Interference",
};

export const Interference = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | null = null;
    if (rootRef.current && canvasRef.current) {
      pane = new Pane({ title: "Quantum Studies" });
      const sketch = new QuantumInterferenceSketch(
        rootRef.current,
        canvasRef.current,
      );
      new GUIQuantumInterference(pane, sketch);
    }

    return () => {
      pane?.dispose();
    };
  }, []);

  return (
    <div className="sketch">
      <p className="load-font-stencil load-font-regular">IXIIIIIXI</p>
      <div className="wordmark" ref={rootRef}>
        <canvas ref={canvasRef} />;
      </div>
    </div>
  );
};
