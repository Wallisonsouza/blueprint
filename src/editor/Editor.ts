import { CameraController } from "../controllers/CameraController";
import { ConnectionController } from "../controllers/ConnectionController";
import { DragController } from "../controllers/DragController";
import { EditorController } from "../controllers/EditorController";
import { EventBus } from "../graph-api/EventBus";
import type { EditorEvents } from "./Events";
import { Scene } from "./Scene";


export class Editor {

  public step: number;
  public scene: Scene;
  public events = new EventBus<EditorEvents>();
  private cameraController: CameraController;
  private dragController: DragController;
  public connectionController: ConnectionController;
  private editorController: EditorController;

  constructor(public target: HTMLElement, step: number = 50) {
    this.step = step;

    this.scene = new Scene();

    this.editorController = new EditorController(this);
    this.dragController = new DragController(this);
    this.cameraController = new CameraController(this);
    this.connectionController = new ConnectionController(this);
  }

  loadScene(scene: Scene) {
    this.scene = scene;
  }

}
