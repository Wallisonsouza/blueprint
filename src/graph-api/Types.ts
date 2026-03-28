import type { BlueprintNode, Position } from "./BlueprintNode";
import type { TypeKind } from "./Map";
import type { GraphState } from "./NodeGraph";

export type PortDirection = "input" | "output";
export type PortId = string;

export interface Port<T = any> {
  value?: T;
  id: string;
  node: BlueprintNode;
  type: TypeKind;
  direction: PortDirection;
  label?: string;
  offset?: Position;
  el?: HTMLElement;
}

export interface Connection {
  id: string;
  from: Port;
  to: Port;
}

export interface NodeLogic {
  nodeId: string;
  execute: (node: BlueprintNode, state: GraphState) => void;
}