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
    if (rootRef.current && canvasRef.current) {
      const wordmark = new WordmarkAlternativeSketch(
        rootRef.current,
        canvasRef.current,
      );
      new WordmarkAlternativeGUI(
        new Pane({ title: "Wordmark Alternative" }),
        wordmark,
      );
    }

    return () => {};
  }, []);

  return (
    <>
      <p className="load-font">IXIIIIIXI</p>
      <div className="wordmark-alternative" ref={rootRef}>
        <canvas ref={canvasRef} />;
      </div>
    </>
  );
};
