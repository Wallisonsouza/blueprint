import type { BlueprintNode, Position } from "./BlueprintNode";
import { Factory } from "./Factory";
import { Types, type TypeKind } from "./Map";


type BuilderCallback = (position: Position) => BlueprintNode;

export class NodeBuilder {
  private static builders: Record<string, BuilderCallback> = {};

  static register(type: string, builder: BuilderCallback) {
    this.builders[type] = builder;
  }

  static getAvailable() {
    return Object.keys(this.builders);
  }

  static create(type: string, position: Position): BlueprintNode | null {
    const builder = this.builders[type];
    if (!builder) return null;
    return builder(position);
  }
}

NodeBuilder.register("Multiply", (position) => {

  const node = Factory.createNode("Multiply", position);

  Factory.createPort(node, Types.Number, "input", "A");
  Factory.createPort(node, Types.Number, "input", "B");

  Factory.createPort(node, Types.Number, "output", "Result");

  return node;
});

NodeBuilder.register("Number", (position) => {

  const node = Factory.createNode("Number", position);

  Factory.createPort(node, Types.Number, "output", "Value");

  return node;
});

NodeBuilder.register("String", (position) => {

  const node = Factory.createNode("String", position);

  Factory.createPort(node, "string" as TypeKind, "output", "Value");

  return node;
});

NodeBuilder.register("Add", (position) => {

  const node = Factory.createNode("Add", position);

  Factory.createPort(node, Types.Number, "input", "A");
  Factory.createPort(node, Types.Number, "input", "B");



  Factory.createPort(node, Types.Number, "output", "Result");
  return node;
});

NodeBuilder.register("Subtract", (position) => {

  const node = Factory.createNode("Subtract", position);

  Factory.createPort(node, Types.Number, "input", "A");
  Factory.createPort(node, Types.Number, "input", "B");

  Factory.createPort(node, Types.Number, "output", "Result");
  return node;
});