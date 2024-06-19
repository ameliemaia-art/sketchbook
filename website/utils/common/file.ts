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
