import type { BlueprintNode } from "../graph-api/BlueprintNode";
import type { Connection, Port } from "../graph-api/Types";

export interface EditorEvents {
  // Node
  nodeDown: { node: BlueprintNode; event: MouseEvent };
  nodeUp: { node: BlueprintNode; event: MouseEvent };
  nodeMove: { node: BlueprintNode; event: MouseEvent };

  // Port
  portEnter: { port: Port };
  portLeave: { port: Port };
  portDown: { port: Port; event: MouseEvent };
  portUp: { port: Port };
  portDrag: { port: Port; x: number; y: number };

  // Camera / viewport
  cameraMove: { offsetX: number; offsetY: number; scale: number };
  cameraZoom: { offsetX: number; offsetY: number; scale: number };

  // Editor redraw / request
  redraw: undefined;

  // Conexões
  connectionCreated: { connection: Connection };
  connectionRemoved: { connection: Connection };
}