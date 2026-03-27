import type { Position } from "./graph-api/BlueprintNode";

export interface PreviewConnection {
  a: Position;
  b: Position;
}

export function drawBezier(
  ctx: CanvasRenderingContext2D,
  from: Position,
  to: Position,
  color = "#e67e22",
  width = 3,
  dashed = false
) {
  const dx = Math.max(Math.abs(to.x - from.x) * 0.5, 20);
  const direction = to.x >= from.x ? 1 : -1;

  const cp1x = from.x + dx * direction;
  const cp2x = to.x - dx * direction;
  const cp1y = from.y;
  const cp2y = to.y;

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dashed ? [5, 5] : []);

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, to.x, to.y);
  ctx.stroke();
}