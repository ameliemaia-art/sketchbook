import { useEffect, useRef } from "react";

import WordmarkSketch, { WordmarkGUI } from "./wordmark";

import "./wordmark.css";
import "../global.css";

import { Pane } from "tweakpane";

export default { title: "Sketchbook/Identity/Wordmark" };

export const Wordmark = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | undefined;
    if (rootRef.current && canvasRef.current) {
      pane = new Pane({ title: "Wordmark" });
      const wordmark = new WordmarkSketch(rootRef.current, canvasRef.current);
      new WordmarkGUI(pane, wordmark);
    }

    return () => {
      pane?.dispose();
    };
  }, []);

  return (
    <>
      <p className="load-font-stencil">IXIIIIIXI</p>
      <div className="wordmark" ref={rootRef}>
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};
