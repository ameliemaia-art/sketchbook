import { useEffect, useRef } from "react";

import "./quantum-waves";

import { Pane } from "tweakpane";

import QuantumWavesSketch, { QuantumWavesGUI } from "./quantum-waves";

export default { title: "Sketchbook/Blueprints/Quantum/Waves/v0" };

export const v0 = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current && canvasRef.current) {
      const sketch = new QuantumWavesSketch(rootRef.current, canvasRef.current);
      new QuantumWavesGUI(new Pane({ title: "Quantum Interferance" }), sketch);
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
