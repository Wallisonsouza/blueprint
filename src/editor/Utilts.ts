import type { Position } from "../graph-api/BlueprintNode";
import type { Port } from "../graph-api/Types";

export function getPortPosition(port: Port): Position {
  return {
    x: port.node.position.x + port.offset!.x,
    y: port.node.position.y + port.offset!.y,
  };
}