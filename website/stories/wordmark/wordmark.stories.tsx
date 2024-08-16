import { useEffect, useRef } from "react";

import WordmarkSketch, { WordmarkGUI } from "./wordmark";

import "./wordmark.css";
import "../global.css";

import { Pane } from "tweakpane";

export default { title: "Sketchbook/Wordmark" };

export const Wordmark = () => {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current && canvasRef.current) {
      const wordmark = new WordmarkSketch(rootRef.current, canvasRef.current);
      const gui = new WordmarkGUI(new Pane({ title: "Wordmark" }), wordmark);
    }

    return () => {};
  }, []);

  return (
    <>
      <p className="load">I · XIII I IX I</p>
      <div className="wordmark" ref={rootRef}>
        <canvas ref={canvasRef} />;
      </div>
    </>
  );
};
