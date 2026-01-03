export function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color = "#ffffff",
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  p0x: number,
  p0y: number,
  p1x: number,
  p1y: number,
  color = "#ffffff",
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(p0x, p0y);
  ctx.lineTo(p1x, p1y);
  ctx.stroke();
  ctx.closePath();
}
