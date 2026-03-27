import type { Position } from "../graph-api/BlueprintNode";
import type { Editor } from "./Editor";
import { getPortPosition } from "./Utilts";

export class Draw {

  public static drawConnections(ctx: CanvasRenderingContext2D, editor: Editor) {

    editor.graph.connections.forEach((conn) => {
      const a = editor.camera.worldToScreen(getPortPosition(conn.from));
      const b = editor.camera.worldToScreen(getPortPosition(conn.to));
      Draw.drawBezier(ctx, a, b, "rgba(0, 0, 0, 1)", 2, false);
    });

    const conn = editor.connectionController.previewConnection;
    if (conn) {
      const a = editor.camera.worldToScreen(conn.a);
      const b = editor.camera.worldToScreen(conn.b);
      Draw.drawBezier(ctx, a, b, "blue", 2, true);
    }
  }

  public static drawBezier(
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

    ctx.setLineDash([]);
  }

  public static drawGrid(ctx: CanvasRenderingContext2D, editor: Editor) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.strokeStyle = "#040404e1";
    ctx.lineWidth = 1 * editor.camera.scale;

    const scaledStep = editor.step * editor.camera.scale;

    const worldZero = editor.camera.worldToScreen({ x: 0, y: 0 });
    const offsetX = worldZero.x % scaledStep;
    const offsetY = worldZero.y % scaledStep;


    // x
    for (let x = offsetX; x < width; x += scaledStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // -x
    for (let x = offsetX - scaledStep; x >= 0; x -= scaledStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // y
    for (let y = offsetY; y < height; y += scaledStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // -y
    for (let y = offsetY - scaledStep; y >= 0; y -= scaledStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
}