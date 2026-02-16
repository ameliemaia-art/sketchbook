import { useEffect, useRef } from "react";

import SoundSketch, { SoundGUI } from "./sound";

import "../global.css";

import { Pane } from "tweakpane";

export default { title: "Sketchbook/Sound/Analysis" };

export const Analysis = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pane: Pane | undefined;
    if (rootRef.current && canvasRef.current) {
      pane = new Pane({ title: "Sound" });
      const sound = new SoundSketch(rootRef.current, canvasRef.current);
      new SoundGUI(pane, sound);
    }

    return () => {
      pane?.dispose();
    };
  }, []);

  return (
    <>
      <div ref={rootRef}>
        {/* <button id="startButton">Play</button> */}
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};
