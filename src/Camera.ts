import type { Position } from "./graph-api/BlueprintNode";

export class Camera {
  public scale: number;
  public offsetX: number;
  public offsetY: number;
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private cameraEl: HTMLDivElement;

  constructor(cameraEl: HTMLDivElement) {
    this.cameraEl = cameraEl;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    cameraEl.addEventListener("mousedown", this.onMouseDown);
    cameraEl.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
  }

  private onMouseDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.startX = e.clientX - this.offsetX;
    this.startY = e.clientY - this.offsetY;
    this.cameraEl.style.cursor = "grabbing";
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    this.offsetX = e.clientX - this.startX;
    this.offsetY = e.clientY - this.startY;
  };

  private onMouseUp = () => {
    this.isDragging = false;
    this.cameraEl.style.cursor = "grab";
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.0015;
    const newScale = Math.min(Math.max(0.5, this.scale - e.deltaY * zoomSensitivity), 3);

    const rect = this.cameraEl.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    this.offsetX -= (mx - this.offsetX) * (newScale / this.scale - 1);
    this.offsetY -= (my - this.offsetY) * (newScale / this.scale - 1);
    this.scale = newScale;
  };

  // Converte coordenadas do mouse para coordenadas do mundo
  public screenToWorld(screenX: number, screenY: number) {
    const rect = this.cameraEl.getBoundingClientRect();
    return {
      x: (screenX - rect.left - this.offsetX) / this.scale,
      y: (screenY - rect.top - this.offsetY) / this.scale,
    };
  }

  // Aplica offset e scale para desenhar no canvas
  public worldToScreen(worldPos: Position) {
    return {
      x: worldPos.x * this.scale + this.offsetX,
      y: worldPos.y * this.scale + this.offsetY,
    };
  }
}