
import type { Editor } from "../editor/Editor";
import type { EditorEvents } from "../editor/Events";

export class CameraController {
  private isDragging = false;
  private startX = 0;
  private startY = 0;

  constructor(
    private editor: Editor
  ) {

    this.editor.events.on("mouseMove", this.onMouseMove);
    this.editor.events.on("mouseUp", this.onMouseUp);
    this.editor.events.on("mouseDown", this.onMouseDown);
    this.editor.events.on("mouseWheel", this.onWheel);
  }

  private onMouseDown = (e: MouseEvent) => {

    if (e.button == 0 || e.button == 1) {
      this.isDragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
    }

  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    this.startX = e.clientX;
    this.startY = e.clientY;

    this.editor.scene.camera.pan(dx, dy);
    this.editor.events.emit("cameraMove", {
      offsetX: this.editor.scene.camera.x,
      offsetY: this.editor.scene.camera.y,
      scale: this.editor.scene.camera.scale,
    });
    this.editor.events.emit("redraw", undefined);
  };

  private onMouseUp = () => {
    this.isDragging = false;
  };

  private onWheel = ({ delta, x, y }: EditorEvents["mouseWheel"]) => {

    const factor = 1 - delta * 0.0015;

    this.editor.scene.camera.zoom(factor, x, y);


    this.editor.events.emit("redraw", undefined);
  };
};
