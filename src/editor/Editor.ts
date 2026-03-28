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

  constructor(step: number = 50) {
    this.step = step;
    this.graph = new NodeGraph();


    this.graph.addNode(NodeBuilder.create("Add", { x: 100, y: 100 })!);
    this.graph.addNode(NodeBuilder.create("Multiply", { x: 200, y: 200 })!);
    this.graph.addNode(NodeBuilder.create("Number", { x: 400, y: 200 })!);

    this.graph.addNode(NodeBuilder.create("Player", { x: 500, y: 300 })!);
    this.graph.addNode(NodeBuilder.create("OnStart", { x: 500, y: 100 })!);
    this.graph.addNode(NodeBuilder.create("OnTick", { x: 500, y: 100 })!);
    this.graph.addNode(NodeBuilder.create("OnKeyPressed", { x: 600, y: 100 })!);
    this.graph.addNode(NodeBuilder.create("OnMouseClick", { x: 700, y: 100 })!);

    this.graph.addNode(NodeBuilder.create("While", { x: 800, y: 100 })!);

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

  loadGraph(graph: NodeGraph) {
    this.graph = graph;

    this.connectionController.setGraph(graph);

    // this.events.emit("redraw", undefined);
  }
}
