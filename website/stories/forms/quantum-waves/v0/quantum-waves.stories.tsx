import { useEffect, useRef } from "react";

import "./quantum-waves";

import { Pane } from "tweakpane";

import QuantumWavesSketch, { QuantumWavesGUI } from "./quantum-waves";

export default { title: "Sketchbook/Forms/Quantum/Waves/v0" };

export const v0 = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | undefined;
    if (rootRef.current && canvasRef.current) {
      pane = new Pane({ title: "Quantum Interferance" });
      const sketch = new QuantumWavesSketch(rootRef.current, canvasRef.current);
      new QuantumWavesGUI(pane, sketch);
    }

    return () => {
      pane?.dispose();
    };
  }, []);

  return (
    <>
      <div className="quantum-interferance" ref={rootRef}>
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};
