import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import CirclesSketch, { GUICirclesSketch } from "./circles";

import "../../global.css";

export default { title: "Sketchbook/Forms/Circles" };

export const Circles = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return () => {};
    const root = rootRef.current;

    const app = new CirclesSketch();
    app
      .setup(root)
      .then(() => {})
      .catch((error) => {
        console.log("error setting up", error);
      });

    const gui = new Pane({
      title: "Metaphysical Form - Circles",
    });
    new GUICirclesSketch(gui, app);

    const resize = () => {
      app.resize(window.innerWidth, window.innerHeight);
    };
    resize();

    window.addEventListener("resize", resize);

    return () => {
      app.dispose();
    };
  }, []);

  return <div className="webgl-app" ref={rootRef}></div>;
};
