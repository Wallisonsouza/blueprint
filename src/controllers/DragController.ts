import type { Editor } from "../editor/Editor";
import type { EditorEvents } from "../editor/Events";
import type { BlueprintNode } from "../graph-api/BlueprintNode";
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

  constructor(private editor: Editor) {

    this.editor.events.on("nodeDown", this.onNodeDown);
    this.editor.events.on("portDown", this.onPortDown);
    this.editor.events.on("mouseMove", this.onDragMove);
    this.editor.events.on("mouseUp", this.onDragUp);
  }

  private onNodeDown = ({ node, event }: EditorEvents["nodeDown"]) => {
    this.dragState = {
      type: "node",
      node,
      startPos: { ...node.position },
      mouseStartWorld: this.editor.scene.camera.screenToWorld(event.clientX, event.clientY),
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
      const currentWorld = this.editor.scene.camera.screenToWorld(e.clientX, e.clientY);

      let targetX = this.dragState.startPos.x + (currentWorld.x - this.dragState.mouseStartWorld.x);
      let targetY = this.dragState.startPos.y + (currentWorld.y - this.dragState.mouseStartWorld.y);

      if (e.ctrlKey) {
        targetX = Math.round(targetX / this.editor.step) * this.editor.step;
        targetY = Math.round(targetY / this.editor.step) * this.editor.step;
      }

      this.dragState.node.position.x = targetX;
      this.dragState.node.position.y = targetY;

      this.editor.events.emit("nodeMove", { node: this.dragState.node, event: e });
    }
    if (this.dragState.type === "port" && this.dragState.port) {
      this.editor.events.emit("portDrag", {
        port: this.dragState.port,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  private onDragUp = (e?: MouseEvent) => {
    if (this.dragState.type === "port" && this.dragState.port) {
      this.editor.events.emit("portUp", { port: this.dragState.port });
    }

    this.dragState = { type: null };
  };
}