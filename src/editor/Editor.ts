import { CameraController } from "../controllers/CameraController";
import { ConnectionController } from "../controllers/ConnectionController";
import { DragController } from "../controllers/DragController";
import { EditorController } from "../controllers/EditorController";
import { NodeBuilder } from "../graph-api/Builder";
import { EventBus } from "../graph-api/EventBus";
import { NodeGraph } from "../graph-api/NodeGraph";
import { Camera } from "./Camera";
import type { EditorEvents } from "./Events";

export class Editor {
  public graph: NodeGraph;
  public camera: Camera;
  public events = new EventBus<EditorEvents>();
  public step: number;

  private cameraController: CameraController;
  private dragController: DragController;
  public connectionController: ConnectionController;
  private editorController: EditorController;

  constructor(ctx: CanvasRenderingContext2D, step: number = 50) {
    this.step = step;
    this.graph = new NodeGraph();


    this.graph.addNode(NodeBuilder.create("Add", { x: 100, y: 100 })!);
    this.graph.addNode(NodeBuilder.create("Multiply", { x: 200, y: 200 })!);
    this.graph.addNode(NodeBuilder.create("Number", { x: 400, y: 200 })!);
    this.graph.addNode(NodeBuilder.create("PrintString", { x: 500, y: 300 })!);

    this.graph.addNode(NodeBuilder.create("EventStart", { x: 500, y: 100 })!);

    this.camera = new Camera();

    this.editorController = new EditorController(this.events, window);
    this.dragController = new DragController(this.events, this.camera, this.step); // passo sincronizado
    this.cameraController = new CameraController(this.events, this.camera);
    this.connectionController = new ConnectionController(
      this.events,
      this.graph,
      this.camera,
    );
  }
}

