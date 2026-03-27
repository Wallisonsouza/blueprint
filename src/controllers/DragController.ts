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
  mouseStart?: { x: number; y: number };
}

export class DragController {
  private dragState: DragState = { type: null };

  private mouseMoveWrapper = (e: Event) => this.onDragMove(e as MouseEvent);
  private mouseUpWrapper = () => this.onDragUp();

  constructor(
    private events: EventBus<EditorEvents>,
    private target: EventTarget = window
  ) {
    this.events.on("nodeDown", this.onNodeDown);
    this.events.on("portDown", this.onPortDown);
  }

  private onNodeDown = ({ node, event }: EditorEvents["nodeDown"]) => {
    this.dragState = {
      type: "node",
      node,
      startPos: { ...node.position },
      mouseStart: { x: event.clientX, y: event.clientY },
    };

    this.target.addEventListener("mousemove", this.mouseMoveWrapper);
    this.target.addEventListener("mouseup", this.mouseUpWrapper);
  };

  private onPortDown = ({ port }: EditorEvents["portDown"]) => {
    this.dragState = {
      type: "port",
      port,
    };

    this.target.addEventListener("mousemove", this.mouseMoveWrapper);
    this.target.addEventListener("mouseup", this.mouseUpWrapper);
  };

  private onDragMove = (e: MouseEvent) => {
    if (!this.dragState.type) return;

    if (
      this.dragState.type === "node" &&
      this.dragState.node &&
      this.dragState.startPos &&
      this.dragState.mouseStart
    ) {
      const dx = e.clientX - this.dragState.mouseStart.x;
      const dy = e.clientY - this.dragState.mouseStart.y;

      this.dragState.node.position.x = this.dragState.startPos.x + dx;
      this.dragState.node.position.y = this.dragState.startPos.y + dy;

      this.events.emit("nodeMove", { node: this.dragState.node, event: e });
    }

    if (this.dragState.type === "port" && this.dragState.port) {
      this.events.emit("redraw", undefined);
      this.events.emit("portDrag", {
        port: this.dragState.port,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  private onDragUp = () => {
    if (this.dragState.type === "port" && this.dragState.port) {
      this.events.emit("portUp", { port: this.dragState.port });
    }

    this.dragState = { type: null };

    this.target.removeEventListener("mousemove", this.mouseMoveWrapper);
    this.target.removeEventListener("mouseup", this.mouseUpWrapper);
  };
}