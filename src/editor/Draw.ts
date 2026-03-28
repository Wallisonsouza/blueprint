import type { Graphics, Renderer } from "pixi.js";
import type { Position } from "../graph-api/BlueprintNode";
import { PORT_COLORS } from "../graph-api/Map";
import type { Connection } from "../graph-api/Types";
import type { Editor } from "./Editor";
import { getPortPosition } from "./Utilts";


export class Draw {


  public getConnectionCollor(c: Connection) {
    return PORT_COLORS[c.from.type];
  }

  public static drawConnections(
    g: Graphics,
    editor: Editor,
  ) {
    editor.graph.connections.forEach((conn) => {
      const a = getPortPosition(conn.from);
      const b = getPortPosition(conn.to);


      Draw.drawBezier(g, a, b, PORT_COLORS[conn.from.type] ?? 0xFFFFFF, 2);

    });
  }

  public static drawPreviewConnection(g: Graphics, editor: Editor) {

    const conn = editor.connectionController.previewConnection;
    if (conn) {

      Draw.drawBezier(g, conn.a, conn.b, 0x0000ff, 2);
    }
  }

  public static drawFlows(
    g: Graphics,
    editor: Editor,
    time: number
  ) {
    editor.graph.connections.forEach((conn) => {
      const a = getPortPosition(conn.from);
      const b = getPortPosition(conn.to);

      Draw.drawFlow(g, a, b, time);
    });
  }

  static drawFlow(
    g: Graphics,
    from: Position,
    to: Position,
    time: number
  ) {
    const dx = Math.max(Math.abs(to.x - from.x) * 0.5, 0.1);
    const direction = to.x >= from.x ? 1 : -1;

    const cp1x = from.x + dx * direction;
    const cp2x = to.x - dx * direction;
    const cp1y = from.y;
    const cp2y = to.y;

    const speed = 0.5;
    const t = (time * speed) % 1;

    const p = Draw.getBezierPoint(t, from, to, cp1x, cp1y, cp2x, cp2y);

    g.circle(p.x, p.y, 8).fill({ color: 0xffff00, alpha: 0.2 });
    g.circle(p.x, p.y, 4).fill(0xffff00);
  }

  static getBezierPoint(
    t: number,
    from: Position,
    to: Position,
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number
  ): Position {
    const x =
      (1 - t) ** 3 * from.x +
      3 * (1 - t) ** 2 * t * cp1x +
      3 * (1 - t) * t ** 2 * cp2x +
      t ** 3 * to.x;

    const y =
      (1 - t) ** 3 * from.y +
      3 * (1 - t) ** 2 * t * cp1y +
      3 * (1 - t) * t ** 2 * cp2y +
      t ** 3 * to.y;

    return { x, y };
  }

  public static drawBezier(
    g: Graphics,
    from: Position,
    to: Position,
    color = 0xe67e22,
    width = 3,
  ) {
    const dx = Math.max(Math.abs(to.x - from.x) * 0.5, 0.1);
    const direction = to.x >= from.x ? 1 : -1;

    const cp1x = from.x + dx * direction;
    const cp2x = to.x - dx * direction;
    const cp1y = from.y;
    const cp2y = to.y;

    g.setStrokeStyle({
      width,
      color,
      alpha: 1
    });

    g.moveTo(from.x, from.y);
    g.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, to.x, to.y);

    g.stroke();
  }

  public static drawGridPixi(
    g: Graphics,
    editor: Editor,
    renderer: Renderer
  ) {
    const width = renderer.width;
    const height = renderer.height;

    const cam = editor.camera;

    const scaledStep = editor.step * cam.scale;

    const worldZero = cam.worldToScreen({ x: 0, y: 0 });

    const offsetX = worldZero.x % scaledStep;
    const offsetY = worldZero.y % scaledStep;


    g.setStrokeStyle({
      width: 1 * cam.scale,
      color: 0x040404,
      alpha: 0.88
    });

    //(direita)
    for (let x = offsetX; x < width; x += scaledStep) {
      g.moveTo(x, 0);
      g.lineTo(x, height);
    }

    //(esquerda)
    for (let x = offsetX - scaledStep; x >= 0; x -= scaledStep) {
      g.moveTo(x, 0);
      g.lineTo(x, height);
    }

    // (baixo)
    for (let y = offsetY; y < height; y += scaledStep) {
      g.moveTo(0, y);
      g.lineTo(width, y);
    }

    // (cima)
    for (let y = offsetY - scaledStep; y >= 0; y -= scaledStep) {
      g.moveTo(0, y);
      g.lineTo(width, y);
    }

    g.stroke();
  }

}