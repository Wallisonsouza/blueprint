
import type { Camera } from "../editor/Camera";
import type { EditorEvents } from "../editor/Events";
import type { EventBus } from "../graph-api/EventBus";

export class CameraController {
  private isDragging = false;
  private startX = 0;
  private startY = 0;

  constructor(
    private events: EventBus<EditorEvents>,
    private camera: Camera,
  ) {

    events.on("mouseMove", this.onMouseMove);
    events.on("mouseUp", this.onMouseUp);
    events.on("mouseDown", this.onMouseDown);
    events.on("mouseWheel", this.onWheel);
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

    this.camera.pan(dx, dy);
    this.events.emit("cameraMove", {
      offsetX: this.camera.x,
      offsetY: this.camera.y,
      scale: this.camera.scale,
    });
    this.events.emit("redraw", undefined);
  };

  private onMouseUp = () => {
    this.isDragging = false;
  };

  private onWheel = ({ delta, x, y }: EditorEvents["mouseWheel"]) => {

    const factor = 1 - delta * 0.0015;

    this.camera.zoom(factor, x, y);


    this.events.emit("redraw", undefined);
  };
};
