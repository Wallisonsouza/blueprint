import { NodeBuilder } from "../graph-api/Builder";
import { NodeGraph } from "../graph-api/NodeGraph";


export const graph = new NodeGraph();

graph.addNode(NodeBuilder.create("Add", { x: 100, y: 100 })!);
graph.addNode(NodeBuilder.create("Multiply", { x: 200, y: 200 })!);
graph.addNode(NodeBuilder.create("Number", { x: 400, y: 200 })!);
graph.addNode(NodeBuilder.create("String", { x: 500, y: 100 })!);