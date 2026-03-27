import type { BlueprintNode, Position } from "./BlueprintNode";
import type { TypeKind } from "./Map";
import { type Connection, type Port } from "./Types";

export class Factory {

  public static createPort(
    node: BlueprintNode,
    kind: TypeKind,
    direction: "input" | "output",
    label?: string
  ): Port {
    const port: Port = {
      id: crypto.randomUUID(),
      node: node,
      type: kind,
      direction,
      label,
    };

    if (port.direction === "input") {
      node.inputs.push(port);
    } else if (port.direction === "output") {
      node.outputs.push(port);
    }

    return port;
  }

  public static createConnection(
    from: Port,
    to: Port
  ): Connection {
    return {
      id: crypto.randomUUID(),
      from,
      to
    };
  }

  public static createNode(
    type: string,
    position: Position = { x: 0, y: 0 },
    data: any = {},
  ): BlueprintNode {
    const nodeId = crypto.randomUUID();

    return {
      id: nodeId,
      type,
      position: position,
      inputs: [],
      outputs: []
    };
  }
}