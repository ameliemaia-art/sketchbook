import { useEffect, useRef } from "react";

import SoundSketch, { SoundGUI } from "./sound";

import "../global.css";

import { Pane } from "tweakpane";

export default { title: "Sketchbook/Sound/Analysis" };

export const Analysis = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rootRef.current && canvasRef.current) {
      const sound = new SoundSketch(rootRef.current, canvasRef.current);
      new SoundGUI(new Pane({ title: "Sound" }), sound);
    }

    return () => {};
  }, []);

  return (
    <>
      <div ref={rootRef}>
        {/* <button id="startButton">Play</button> */}
        <canvas ref={canvasRef} />;
      </div>
    </>
  );
};
