import { useEffect, useRef } from "react";

import "./quantum-interference";

import { Pane } from "tweakpane";

import QuantumInterferanceSketch, {
  QuantumInterferanceGUI,
} from "./quantum-interference";

export default { title: "Sketchbook/Blueprints/Quantum/Interference/v1" };

export const v1 = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current && canvasRef.current) {
      const sketch = new QuantumInterferanceSketch(
        rootRef.current,
        canvasRef.current,
      );
      new QuantumInterferanceGUI(
        new Pane({ title: "Quantum Interferance" }),
        sketch,
      );
    }

    return () => {};
  }, []);

  return (
    <>
      <div className="quantum-interferance" ref={rootRef}>
        <canvas ref={canvasRef} />;
      </div>
    </>
  );
};
