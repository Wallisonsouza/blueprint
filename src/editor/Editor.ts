import { CameraController } from "../controllers/CameraController";
import { ConnectionController } from "../controllers/ConnectionController";
import { DragController } from "../controllers/DragController";
import { EditorController } from "../controllers/EditorController";
import { NodeBuilder } from "../graph-api/Builder";
import { EventBus } from "../graph-api/EventBus";
import { NodeGraph } from "../graph-api/NodeGraph";
import { Camera } from "./Camera";
import type { EditorEvents } from "./Events";


export class Scene {
  graph: NodeGraph;
  camera: Camera;

  constructor() {
    this.graph = new NodeGraph();
    this.camera = new Camera();
  }
}

export class Editor {
  public events = new EventBus<EditorEvents>();
  public step: number;

  public scene: Scene;

  private cameraController: CameraController;
  private dragController: DragController;
  public connectionController: ConnectionController;
  private editorController: EditorController;

  constructor(step: number = 50) {
    this.step = step;

    this.scene = new Scene();

    this.scene.graph.addNode(NodeBuilder.create("Add", { x: 100, y: 100 })!);
    this.scene.graph.addNode(NodeBuilder.create("Multiply", { x: 200, y: 200 })!);
    this.scene.graph.addNode(NodeBuilder.create("Number", { x: 400, y: 200 })!);

    this.scene.graph.addNode(NodeBuilder.create("Player", { x: 500, y: 300 })!);
    this.scene.graph.addNode(NodeBuilder.create("OnStart", { x: 500, y: 100 })!);
    this.scene.graph.addNode(NodeBuilder.create("OnTick", { x: 500, y: 100 })!);
    this.scene.graph.addNode(NodeBuilder.create("OnKeyPressed", { x: 600, y: 100 })!);
    this.scene.graph.addNode(NodeBuilder.create("OnMouseClick", { x: 700, y: 100 })!);

    this.scene.graph.addNode(NodeBuilder.create("While", { x: 800, y: 100 })!);

    this.editorController = new EditorController(this.events, window);
    this.dragController = new DragController(this.events, this.scene.camera, this.step);
    this.cameraController = new CameraController(this.events, this.scene.camera);
    this.connectionController = new ConnectionController(
      this.events,
      this.scene.graph,
      this.scene.camera,
    );
  }

  loadGraph(graph: NodeGraph) {

    // this.connectionController.setGraph(graph);

    // this.events.emit("redraw", undefined);
  }
}
