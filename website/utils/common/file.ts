import { saveAs } from "file-saver";

export function saveImage(
  canvas: HTMLCanvasElement,
  title: string,
  format = "image/png",
  quality = 1,
) {
  const filename = `${title}-${new Date().getTime()}.${format.split("/")[1]}`;
  canvas.toBlob(
    function (blob) {
      if (blob) saveAs(blob, filename);
    },
    format,
    quality,
  );
}

export function composite(
  width: number,
  height: number,
  layers: HTMLCanvasElement[],
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    layers.forEach((layer) => {
      ctx.drawImage(layer, 0, 0, width, height);
    });
  }

  return canvas;
}
