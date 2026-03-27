import type { BlueprintNode } from "./BlueprintNode";
import { Factory } from "./Factory";
import { Types } from "./Map";
import type { Connection, NodeLogic, Port } from "./Types";

export class GraphViewState {
  hoveredPortId: string | null = null;
  hoveredNodeId: string | null = null;

  linkingFrom: string | null = null;

  mouseWorld = { x: 0, y: 0 };
}

export class GraphState {
  private values = new Map<string, any>();

  set(portId: string, value: any) {
    this.values.set(portId, value);
  }

  get(portId: string) {
    return this.values.get(portId);
  }

  has(portId: string) {
    return this.values.has(portId);
  }

  clear() {
    this.values.clear();
  }
}

export class NodeGraph extends EventTarget {
  nodes: Map<string, BlueprintNode> = new Map();
  logics: Map<string, NodeLogic> = new Map();

  connections: Map<string, Connection> = new Map();

  private connectionsByFrom = new Map<string, Connection[]>();
  private connectionsByTo = new Map<string, Connection[]>();
  private connectionSet = new Set<string>();


  private portMap = new Map<string, Port>();
  public inPorts = new Map<string, Port[]>();
  public outPorts = new Map<string, Port[]>();
  public execIn = new Map<string, Port[]>();
  public execOut = new Map<string, Port[]>();

  addNode(node: BlueprintNode) {
    this.nodes.set(node.id, node);

    this.inPorts.delete(node.id);
    this.outPorts.delete(node.id);
    this.execIn.delete(node.id);
    this.execOut.delete(node.id);

    node.inputs.forEach(port => {

      this.portMap.set(port.id, port);

      if (port.type === Types.Exec) {
        const arr = this.execIn.get(node.id) ?? [];
        arr.push(port);
        this.execIn.set(node.id, arr);
      } else {
        const arr = this.inPorts.get(node.id) ?? [];
        arr.push(port);
        this.inPorts.set(node.id, arr);
      }
    });

    node.outputs.forEach(port => {

      this.portMap.set(port.id, port);

      if (port.type === Types.Exec) {
        const arr = this.execOut.get(node.id) ?? [];
        arr.push(port);
        this.execOut.set(node.id, arr);
      } else {
        const arr = this.outPorts.get(node.id) ?? [];
        arr.push(port);
        this.outPorts.set(node.id, arr);
      }
    });
  }

  getPort(id: string) {
    return this.portMap.get(id) ?? null;
  }

  getNode(id: string) {
    return this.nodes.get(id) ?? null;
  }

  getNodePorts(nodeId: string) {
    return {
      in: this.inPorts.get(nodeId) ?? [],
      out: this.outPorts.get(nodeId) ?? [],
      execIn: this.execIn.get(nodeId) ?? [],
      execOut: this.execOut.get(nodeId) ?? [],
    };
  }

  connect(from: Port, to: Port) {
    if (from.direction !== "output" || to.direction !== "input") return;
    if (from.type !== to.type && from.type !== "any" && to.type !== "any") return;
    if (from.node === to.node) return;

    const key = `${from.id}->${to.id}`;
    if (this.connectionSet.has(key)) return;


    const existing = this.connectionsByTo.get(to.id);
    existing?.forEach(c => {
      this.connections.delete(c.id);
      this.connectionSet.delete(`${c.from.id}->${c.to.id}`);
    });

    const conn = Factory.createConnection(from, to);

    this.connections.set(conn.id, conn);
    this.connectionSet.add(key);
    this.connectionsByFrom.set(from.id, [...(this.connectionsByFrom.get(from.id) ?? []), conn]);
    this.connectionsByTo.set(to.id, [conn]);
  }

  disconnect(connection: Connection) {
    this.connections.delete(connection.id);

    this.connectionSet.delete(`${connection.from.id}->${connection.to.id}`);

    const fromList = this.connectionsByFrom.get(connection.from.id);
    if (fromList) {
      this.connectionsByFrom.set(
        connection.from.id,
        fromList.filter(c => c.id !== connection.id)
      );
    }

    const toList = this.connectionsByTo.get(connection.to.id);
    if (toList) {
      this.connectionsByTo.set(
        connection.to.id,
        toList.filter(c => c.id !== connection.id)
      );
    }
  }


  public getFirstConnectionByPort(port: Port) {
    if (port.direction === "output") {
      return this.connectionsByFrom.get(port.id)?.[0] ?? null;
    } else {
      return this.connectionsByTo.get(port.id)?.[0] ?? null;
    }
  }
}
