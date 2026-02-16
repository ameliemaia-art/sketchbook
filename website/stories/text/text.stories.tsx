import { useEffect, useRef } from "react";

import TextSketch, { TextGUI } from "./text";

import "./text.css";
import "../global.css";

import { Pane } from "tweakpane";

export default { title: "Sketchbook/Identity/Text" };

export const Text = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | undefined;
    if (rootRef.current && canvasRef.current) {
      pane = new Pane({ title: "Text" });
      const Text = new TextSketch(
        rootRef.current,
        "Vector Equilibrium Sperical",
      );
      new TextGUI(pane, Text);
    }

    return () => {
      pane?.dispose();
    };
  }, []);

  return (
    <>
      <p className="load-font-regular">IXIIIIIXI</p>
      <div className="Text" ref={rootRef}>
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};
