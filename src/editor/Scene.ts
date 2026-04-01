import { NodeGraph } from "../graph-api/NodeGraph";
import { Camera } from "./Camera";

export class Scene {
  graph: NodeGraph;
  camera: Camera;

  constructor() {
    this.graph = new NodeGraph();
    this.camera = new Camera();
  }

  public static deserialize(json: string) {

  }
}