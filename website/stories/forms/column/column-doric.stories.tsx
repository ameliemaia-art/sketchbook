import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import "../../global.css";

import ColumnDoricForm, { GUIColumnDoricForm } from "./column-doric";

export default { title: "Sketchbook/Forms/ColumnDoric" };

export const ColumnDoric = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return () => {};
    const root = rootRef.current;

    const app = new ColumnDoricForm();
    app
      .setup(root)
      .then(() => {})
      .catch((error) => {
        console.log("error setting up", error);
      });

    const gui = new Pane({
      title: "Metaphysical Form - Column Doric",
    });
    new GUIColumnDoricForm(gui, app);

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
