import { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";

import ColumnBase, { GUIColumnBase } from "./column-base";

const meta: Meta = {
  title: "Blueprints/Column/Base",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (!containerRef.current || !canvasRef.current) return;

      const pane = new Pane({ title: "Column Base Blueprint" });
      const sketch = new ColumnBase(containerRef.current, canvasRef.current);
      const gui = new GUIColumnBase(pane, sketch);

      return () => {
        pane.dispose();
      };
    }, []);

    return (
      <div className="relative h-screen w-screen bg-black">
        <div ref={containerRef} className="h-full w-full">
          <canvas
            ref={canvasRef}
            className="block h-full w-full"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </div>
    );
  },
};

export const PlinthOnly: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (!containerRef.current || !canvasRef.current) return;

      const pane = new Pane({ title: "Column Base - Plinth Only" });
      const sketch = new ColumnBase(containerRef.current, canvasRef.current);
      
      // Configure to show only plinth
      sketch.settings.form.layers.lowerTorus.visible = false;
      sketch.settings.form.layers.middleTorus.visible = false;
      sketch.settings.form.layers.upperTorus.visible = false;
      sketch.settings.form.layers.shaftTorus.visible = false;
      
      const gui = new GUIColumnBase(pane, sketch);

      return () => {
        pane.dispose();
      };
    }, []);

    return (
      <div className="relative h-screen w-screen bg-black">
        <div ref={containerRef} className="h-full w-full">
          <canvas
            ref={canvasRef}
            className="block h-full w-full"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </div>
    );
  },
};

export const TorusStudy: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (!containerRef.current || !canvasRef.current) return;

      const pane = new Pane({ title: "Column Base - Torus Study" });
      const sketch = new ColumnBase(containerRef.current, canvasRef.current);
      
      // Configure to show only torus elements
      sketch.settings.form.layers.plinth.visible = false;
      sketch.settings.form.layers.shaftTorus.visible = false;
      sketch.settings.form.debug = true;
      
      const gui = new GUIColumnBase(pane, sketch);

      return () => {
        pane.dispose();
      };
    }, []);

    return (
      <div className="relative h-screen w-screen bg-black">
        <div ref={containerRef} className="h-full w-full">
          <canvas
            ref={canvasRef}
            className="block h-full w-full"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </div>
    );
  },
};

export const DebugMode: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (!containerRef.current || !canvasRef.current) return;

      const pane = new Pane({ title: "Column Base - Debug Mode" });
      const sketch = new ColumnBase(containerRef.current, canvasRef.current);
      
      // Enable debug mode
      sketch.settings.form.debug = true;
      
      const gui = new GUIColumnBase(pane, sketch);

      return () => {
        pane.dispose();
      };
    }, []);

    return (
      <div className="relative h-screen w-screen bg-black">
        <div ref={containerRef} className="h-full w-full">
          <canvas
            ref={canvasRef}
            className="block h-full w-full"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </div>
    );
  },
};
