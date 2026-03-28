import type { Port } from "./Types";

export interface Position {
  x: number,
  y: number
}

export type NodeCategory =
  | "event"
  | "flow"
  | "data"
  | "logic"
  | "math";

export interface BlueprintNode {
  id: string;
  type: string;
  category: NodeCategory;
  position: Position;
  inputs: Port[];
  outputs: Port[];
}