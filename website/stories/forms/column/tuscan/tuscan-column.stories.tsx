import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import "../../../global.css";

import ColumnTuscanForm, { GUIColumnTuscanForm } from "./tuscan-column";

export default { title: "Sketchbook/Forms/Tuscan Column" };

export const TuscanColumn = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return () => {};
    const root = rootRef.current;

    const app = new ColumnTuscanForm();
    app
      .setup(root)
      .then(() => {})
      .catch((error) => {
        console.log("error setting up", error);
      });

    const gui = new Pane({
      title: "Metaphysical Form - Tuscan Column",
    });
    new GUIColumnTuscanForm(gui, app);

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
