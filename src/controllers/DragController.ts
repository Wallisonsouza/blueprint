import type { Camera } from "../editor/Camera";
import type { EditorEvents } from "../editor/Events";
import type { BlueprintNode } from "../graph-api/BlueprintNode";
import type { EventBus } from "../graph-api/EventBus";
import type { Port } from "../graph-api/Types";

type DragType = "node" | "port" | null;

interface DragState {
  type: DragType;
  node?: BlueprintNode;
  port?: Port;
  startPos?: { x: number; y: number };
  mouseStartWorld?: { x: number; y: number };
}

export class DragController {
  private dragState: DragState = { type: null };
  public step;

  constructor(private events: EventBus<EditorEvents>, private camera: Camera, step: number = 1) {

    this.step = step;
    this.events.on("nodeDown", this.onNodeDown);
    this.events.on("portDown", this.onPortDown);
    this.events.on("mouseMove", this.onDragMove);
    this.events.on("mouseUp", this.onDragUp);
  }

  private onNodeDown = ({ node, event }: EditorEvents["nodeDown"]) => {
    this.dragState = {
      type: "node",
      node,
      startPos: { ...node.position },
      mouseStartWorld: this.camera.screenToWorld(event.clientX, event.clientY),
    };
  };

  private onPortDown = ({ port }: EditorEvents["portDown"]) => {
    this.dragState = {
      type: "port",
      port,
    };
  };

  private onDragMove = (e: MouseEvent) => {
    if (!this.dragState.type) return;

    if (this.dragState.type === "node" && this.dragState.node && this.dragState.startPos && this.dragState.mouseStartWorld) {
      const currentWorld = this.camera.screenToWorld(e.clientX, e.clientY);

      let targetX = this.dragState.startPos.x + (currentWorld.x - this.dragState.mouseStartWorld.x);
      let targetY = this.dragState.startPos.y + (currentWorld.y - this.dragState.mouseStartWorld.y);

      if (e.ctrlKey) {
        targetX = Math.round(targetX / this.step) * this.step;
        targetY = Math.round(targetY / this.step) * this.step;
      }

      this.dragState.node.position.x = targetX;
      this.dragState.node.position.y = targetY;

      this.events.emit("nodeMove", { node: this.dragState.node, event: e });
    }
    if (this.dragState.type === "port" && this.dragState.port) {
      this.events.emit("portDrag", {
        port: this.dragState.port,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  private onDragUp = (e?: MouseEvent) => {
    if (this.dragState.type === "port" && this.dragState.port) {
      this.events.emit("portUp", { port: this.dragState.port });
    }

    this.dragState = { type: null };
  };
}