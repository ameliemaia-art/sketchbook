import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import HypatiaSketch, { GUIHypatiaSketch } from "./hypatia";

import "../../global.css";

export default { title: "Sketchbook/Forms/Hypatia" };

export const Hypatia = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return () => {};
    const root = rootRef.current;

    const app = new HypatiaSketch();
    app
      .setup(root)
      .then(() => {})
      .catch((error) => {
        console.log("error setting up", error);
      });

    const gui = new Pane({
      title: "Metaphysical Form - Hypatia",
    });
    new GUIHypatiaSketch(gui, app);

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
