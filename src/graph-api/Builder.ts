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

  const node = Factory.createNode("Multiply", "math", position);

  Factory.createPort(node, Types.Number, "input", "A");
  Factory.createPort(node, Types.Number, "input", "B");

  Factory.createPort(node, Types.Number, "output", "Result");

  return node;
});

NodeBuilder.register("Number", (position) => {

  const node = Factory.createNode("Number", "math", position);

  Factory.createPort(node, Types.Number, "output", "Value");

  return node;
});

NodeBuilder.register("String", (position) => {

  const node = Factory.createNode("String", "math", position);

  Factory.createPort(node, "string" as TypeKind, "output", "Value");

  return node;
});

NodeBuilder.register("Add", (position) => {

  const node = Factory.createNode("Add", "math", position);

  Factory.createPort(node, Types.Number, "input", "A");
  Factory.createPort(node, Types.Number, "input", "B");



  Factory.createPort(node, Types.Number, "output", "Result");
  return node;
});

NodeBuilder.register("Subtract", (position) => {

  const node = Factory.createNode("Subtract", "math", position);

  Factory.createPort(node, Types.Number, "input", "A");
  Factory.createPort(node, Types.Number, "input", "B");

  Factory.createPort(node, Types.Number, "output", "Result");
  return node;
});

NodeBuilder.register("OnStart", (position) => {
  const node = Factory.createNode("OnStart", "event", position);


  Factory.createPort(node, "exec", "output", "Exec");

  return node;
});

NodeBuilder.register("Player", (position) => {
  const node = Factory.createNode("Player", "data", position);

  Factory.createPort(node, "number", "input", "Healt");
  Factory.createPort(node, "number", "input", "Mana");
  Factory.createPort(node, "number", "input", "Speed");

  return node;
});

NodeBuilder.register("OnUpdate", (position) => {
  const node = Factory.createNode("OnUpdate", "event", position);

  Factory.createPort(node, "exec", "output", "Exec");

  return node;
});

NodeBuilder.register("OnTick", (position) => {
  const node = Factory.createNode("OnTick", "event", position);

  Factory.createPort(node, "exec", "output", "Exec");

  Factory.createPort(node, "number", "output", "DeltaTime");

  return node;
});

NodeBuilder.register("OnKeyPressed", (position) => {
  const node = Factory.createNode("OnKeyPressed", "event", position);

  Factory.createPort(node, "exec", "output", "Exec");
  Factory.createPort(node, "string", "output", "Key");

  return node;
});

NodeBuilder.register("OnMouseClick", (position) => {
  const node = Factory.createNode("OnMouseClick", "event", position);

  Factory.createPort(node, "exec", "output", "Exec");
  Factory.createPort(node, "number", "output", "X");
  Factory.createPort(node, "number", "output", "Y");

  return node;
});

NodeBuilder.register("While", (position) => {
  const node = Factory.createNode("While", "flow", position);

  Factory.createPort(node, "exec", "input", "In");

  Factory.createPort(node, "boolean", "input", "Condition");

  Factory.createPort(node, "exec", "output", "Loop");
  Factory.createPort(node, "exec", "output", "Completed");

  return node;
});