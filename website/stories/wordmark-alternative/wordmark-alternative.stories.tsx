import { useEffect, useRef } from "react";

import WordmarkAlternativeSketch, {
  WordmarkAlternativeGUI,
} from "./wordmark-alternative";

import "./wordmark-alternative.css";
import "../global.css";

import { Pane } from "tweakpane";

export default { title: "Sketchbook/Identity/Wordmark Alternative" };

export const WordmarkAlternative = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | undefined;
    if (rootRef.current && canvasRef.current) {
      pane = new Pane({ title: "Wordmark Alternative" });
      const wordmark = new WordmarkAlternativeSketch(
        rootRef.current,
        canvasRef.current,
      );
      new WordmarkAlternativeGUI(pane, wordmark);
    }

    return () => {
      pane?.dispose();
    };
  }, []);

  return (
    <>
      <p className="load-font-stencil">IXIIIIIXI</p>
      <div className="wordmark-alternative" ref={rootRef}>
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};
