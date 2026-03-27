import type { EditorEvents } from "../editor/Events";
import type { EventBus } from "../graph-api/EventBus";

export class EditorController {
  constructor(private events: EventBus<EditorEvents>, private target: HTMLElement | Window = window) {

    this.target.addEventListener("mousedown", this.onMouseDown as any);
    this.target.addEventListener("mousemove", this.onMouseMove as any);
    this.target.addEventListener("mouseup", this.onMouseUp as any);
    this.target.addEventListener("wheel", this.onWheel as any, { passive: false });
  }

  private onMouseDown = (e: MouseEvent) => {
    this.events.emit("mouseDown", e);
  };

  private onMouseMove = (e: MouseEvent) => {
    this.events.emit("mouseMove", e);
  };

  private onMouseUp = (e: MouseEvent) => {
    this.events.emit("mouseUp", e);
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const canvasRect = this.target instanceof HTMLElement ? this.target.getBoundingClientRect() : { left: 0, top: 0 };
    this.events.emit("mouseWheel", {
      delta: e.deltaY,
      x: e.clientX - canvasRect.left,
      y: e.clientY - canvasRect.top,
    });
  };
}