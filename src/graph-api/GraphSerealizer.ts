import type { BlueprintNode } from "./BlueprintNode";
import { NodeGraph } from "./NodeGraph";

export function serializeGraph(graph: NodeGraph) {
  return JSON.stringify({
    version: 3,

    nodes: Array.from(graph.nodes.values()).map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,

      inputs: node.inputs.map(p => ({
        id: p.id,
        type: p.type,
        label: p.label
      })),

      outputs: node.outputs.map(p => ({
        id: p.id,
        type: p.type,
        label: p.label
      }))
    })),

    connections: Array.from(graph.connections.values()).map(c => ({
      id: c.id,
      from: c.from,
      to: c.to
    }))
  });
}

export function deserializeGraph(json: string): NodeGraph {
  const data = JSON.parse(json);

  const graph = new NodeGraph();

  data.nodes.forEach((n: any) => {
    const node: BlueprintNode = {
      id: n.id,
      type: n.type,
      position: n.position,

      inputs: n.inputs.map((p: any) => ({
        ...p,
        nodeId: n.id,
        direction: "input"
      })),

      outputs: n.outputs.map((p: any) => ({
        ...p,
        nodeId: n.id,
        direction: "output"
      }))
    };

    graph.addNode(node);
  });

  data.connections.forEach((c: any) => {
    graph.connect(c.from, c.to);
  });

  return graph;
}