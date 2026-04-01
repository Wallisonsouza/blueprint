import type { Editor } from "../editor/Editor";


export class EditorController {
  constructor(private editor: Editor) {
    editor.target.addEventListener("mousedown", this.onMouseDown as any);
    editor.target.addEventListener("mousemove", this.onMouseMove as any);
    editor.target.addEventListener("mouseup", this.onMouseUp as any);
    editor.target.addEventListener("wheel", this.onWheel as any, { passive: false });
  }

  private onMouseDown = (e: MouseEvent) => {
    this.editor.events.emit("mouseDown", e);
  };

  private onMouseMove = (e: MouseEvent) => {
    this.editor.events.emit("mouseMove", e);
  };

  private onMouseUp = (e: MouseEvent) => {
    this.editor.events.emit("mouseUp", e);
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const canvasRect = this.editor.target.getBoundingClientRect();
    this.editor.events.emit("mouseWheel", {
      delta: e.deltaY,
      x: e.clientX - canvasRect.left,
      y: e.clientY - canvasRect.top,
    });
  };
}