export class Camera {
  public scale = 1;
  public x = 0;
  public y = 0;

  constructor() { }

  pan(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  zoom(factor: number, centerX: number, centerY: number) {
    const newScale = Math.min(Math.max(0.5, this.scale * factor), 3);
    this.x -= (centerX - this.x) * (newScale / this.scale - 1);
    this.y -= (centerY - this.y) * (newScale / this.scale - 1);
    this.scale = newScale;
  }

  screenToWorld(x: number, y: number) {
    return { x: (x - this.x) / this.scale, y: (y - this.y) / this.scale };
  }

  worldToScreen(pos: { x: number; y: number }) {
    return { x: pos.x * this.scale + this.x, y: pos.y * this.scale + this.y };
  }
}