import type { BlueprintNode } from "../graph-api/BlueprintNode";
import type { Port } from "../graph-api/Types";


export interface PortEvents {
  portDown: { port: Port; event: MouseEvent };
  portUp: { port: Port };
  portDrag: { port: Port; x: number; y: number };

  portEnter: { port: Port };
  portLeave: { port: Port };
}

export interface NodeEditorEvents extends PortEvents {

  nodeUpdate: {};
  nodeUp: { node: BlueprintNode; event: MouseEvent };
  nodeDown: { node: BlueprintNode; event: MouseEvent };
  nodeMove: { node: BlueprintNode; event: MouseEvent };
}