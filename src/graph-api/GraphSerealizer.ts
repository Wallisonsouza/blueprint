import type { Camera } from "../editor/Camera";
import { Scene } from "../editor/Scene";
import type { BlueprintNode, NodeCategory, Position } from "./BlueprintNode";
import type { TypeKind } from "./Map";
import type { Port } from "./Types";

export interface SerializedScene {
  camera: Camera;
  graph: SerializedGraph;
}

export interface SerializedPort {
  id: string;
  nodeId: string;
  type: TypeKind;
  label?: string;
}

export interface SerializedNode {
  id: string;
  type: string;
  category: NodeCategory;
  position: Position;
  inputs: SerializedPort[];
  outputs: SerializedPort[];
}

export interface SerializedConnection {
  id: string;
  fromId: string;
  toId: string;
}

export interface SerializedGraph {
  nodes: SerializedNode[];
  connections: SerializedConnection[];
}

export class SceneSerealizer {

  public static serialize(scene: Scene): string {

    const serialized: SerializedScene = {
      camera: scene.camera,
      graph: {
        nodes: Array.from(scene.graph.nodes.values()).map(node => ({
          id: node.id,
          category: node.category,
          type: node.type,
          position: node.position,

          inputs: node.inputs.map(p => ({
            id: p.id,
            nodeId: node.id,
            type: p.type,
            label: p.label
          })),

          outputs: node.outputs.map(p => ({
            id: p.id,
            nodeId: node.id,
            type: p.type,
            label: p.label
          }))
        })),

        connections: Array.from(scene.graph.connections.values()).map(c => ({
          id: c.id,
          fromId: c.from.id,
          toId: c.to.id
        }))
      }
    }

    return JSON.stringify(serialized);
  }

  public static deserialize(json: string): Scene {

    const data: SerializedScene = JSON.parse(json);

    const scene = new Scene();

    for (const n of data.graph.nodes) {

      const node: BlueprintNode = {
        id: n.id,
        category: n.category,
        type: n.type,
        position: n.position,
        inputs: [],
        outputs: []
      };

      for (const p of n.inputs) {
        const port: Port = {
          id: p.id,
          node,
          type: p.type,
          label: p.label,
          direction: "input",
          offset: { x: 0, y: 0 }
        };

        node.inputs.push(port);
      }

      for (const p of n.outputs) {
        const port: Port = {
          id: p.id,
          node,
          type: p.type,
          label: p.label,
          direction: "output",
          offset: { x: 0, y: 0 }
        };

        node.outputs.push(port);
      }

      scene.graph.addNode(node);
    }

    for (const c of data.graph.connections) {
      const from = scene.graph.getPort(c.fromId);
      const to = scene.graph.getPort(c.toId);

      if (from && to) {
        scene.graph.connect(from, to);
      } else {
        console.warn("Connection inválida:", c);
      }
    }

    return scene;
  }
}
