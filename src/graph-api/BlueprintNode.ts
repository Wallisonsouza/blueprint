import type { Port } from "./Types";

export interface Position {
  x: number,
  y: number
}

export interface BlueprintNode {
  id: string;
  type: string;
  position: Position;
  inputs: Port[];
  outputs: Port[];
}