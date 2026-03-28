import type { BlueprintNode, NodeCategory, Position } from "./BlueprintNode";
import type { TypeKind } from "./Map";
import { NodeGraph } from "./NodeGraph";
import type { Port } from "./Types";

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
  version: number;
  nodes: SerializedNode[];
  connections: SerializedConnection[];
}


export function serializeGraph(graph: NodeGraph): string {
  const data: SerializedGraph = {
    version: 3,

    nodes: Array.from(graph.nodes.values()).map(node => ({
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

    connections: Array.from(graph.connections.values()).map(c => ({
      id: c.id,
      fromId: c.from.id,
      toId: c.to.id
    }))
  };

  console.log("saved", JSON.stringify(data));

  return JSON.stringify(data);
}

export function deserializeGraph(json: string): NodeGraph {
  const data: SerializedGraph = JSON.parse(json);

  const graph = new NodeGraph();

  for (const n of data.nodes) {

    console.log(n)

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

    graph.addNode(node);
  }

  for (const c of data.connections) {
    const from = graph.getPort(c.fromId);
    const to = graph.getPort(c.toId);

    if (from && to) {
      graph.connect(from, to);
    } else {
      console.warn("Connection inválida:", c);
    }
  }

  return graph;
}