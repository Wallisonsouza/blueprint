import type { EditorEvents } from "../editor/Events";
import type { BlueprintNode } from "../graph-api/BlueprintNode";
import type { EventBus } from "../graph-api/EventBus";
import type { Port } from "../graph-api/Types";

export class DragController {
  private draggingNode: BlueprintNode | null = null;
  private draggingPort: Port | null = null;

  private nodeStart = { x: 0, y: 0 };
  private mouseStart = { x: 0, y: 0 };

  constructor(private events: EventBus<EditorEvents>) {
    this.events.on("nodeDown", this.onNodeDown);
    this.events.on("portDown", this.onPortDown);
  }

  // ----------------- NODE -----------------
  private onNodeDown = ({ node, event }: EditorEvents["nodeDown"]) => {
    this.draggingNode = node;

    this.nodeStart = { ...node.position };
    this.mouseStart = { x: event.clientX, y: event.clientY };

    window.addEventListener("mousemove", this.onNodeMove);
    window.addEventListener("mouseup", this.onNodeUp);
  };

  private onNodeMove = (e: MouseEvent) => {
    if (!this.draggingNode) return;

    const dx = e.clientX - this.mouseStart.x;
    const dy = e.clientY - this.mouseStart.y;

    this.draggingNode.position.x = this.nodeStart.x + dx;
    this.draggingNode.position.y = this.nodeStart.y + dy;

    this.events.emit("nodeMove", { node: this.draggingNode, event: e });
  };

  private onNodeUp = () => {
    this.draggingNode = null;
    window.removeEventListener("mousemove", this.onNodeMove);
    window.removeEventListener("mouseup", this.onNodeUp);
  };

  // ----------------- PORT -----------------
  private onPortDown = ({ port }: EditorEvents["portDown"]) => {
    this.draggingPort = port;

    window.addEventListener("mousemove", this.onPortMove);
    window.addEventListener("mouseup", this.onPortUp);
  };

  private onPortMove = (e: MouseEvent) => {
    if (!this.draggingPort) return;

    this.events.emit("redraw"); // Atualiza visual
    this.events.emit("portDrag", {
      port: this.draggingPort,
      x: e.clientX,
      y: e.clientY,
    });
  };

  private onPortUp = () => {
    if (!this.draggingPort) return;

    this.events.emit("portUp", { port: this.draggingPort });
    this.draggingPort = null;

    window.removeEventListener("mousemove", this.onPortMove);
    window.removeEventListener("mouseup", this.onPortUp);
  };
}