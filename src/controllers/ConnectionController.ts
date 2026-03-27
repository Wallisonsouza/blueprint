import type { Camera } from "../editor/Camera";
import type { EditorEvents } from "../editor/Events";
import { getPortPosition } from "../editor/Utilts";
import type { Position } from "../graph-api/BlueprintNode";
import type { EventBus } from "../graph-api/EventBus";
import type { NodeGraph } from "../graph-api/NodeGraph";
import type { Connection, Port } from "../graph-api/Types";


interface PreviewConnection {
  a: Position;
  b: Position;
}

interface PortState {
  port: Port | null;
  connection: Connection | null;
  isFrom?: boolean;
}

export class ConnectionController {
  public previewConnection: PreviewConnection | null = null;
  private portState: PortState = { port: null, connection: null };
  private hoveredPort: Port | null = null;

  constructor(
    private events: EventBus<EditorEvents>,
    private graph: NodeGraph,
    private camera: Camera,
  ) {
    this.events.on("portEnter", this.onPortEnter);
    this.events.on("portLeave", this.onPortLeave);
    this.events.on("portDown", this.onPortDown);
    this.events.on("portDrag", this.onPortDrag);
    this.events.on("mouseUp", this.onMouseUp);
  }


  private onMouseUp = () => {
    if (!this.previewConnection || !this.portState.port) return;

    if (this.hoveredPort && this.hoveredPort !== this.portState.port) {
      this.graph.connect(this.portState.port, this.hoveredPort);
    }

    this.previewConnection = null;
    this.portState = { port: null, connection: null };

    this.events.emit("redraw", undefined);

  };

  private onPortEnter = ({ port }: EditorEvents["portEnter"]) => {
    this.hoveredPort = port;


  };

  private onPortLeave = ({ port }: EditorEvents["portLeave"]) => {
    if (this.hoveredPort === port) this.hoveredPort = null;

  };

  private onPortDown = ({ port, event }: EditorEvents["portDown"]) => {
    const conn = this.graph.getFirstConnectionByPort(port);

    this.portState = {
      port,
      connection: conn,
      isFrom: port.direction === "output",
    };

    if (event.ctrlKey && conn) {
      this.startRelink(port, conn);
    } else {
      this.startNewConnection(port);
    }
  };

  private onPortDrag = ({ port, x, y }: EditorEvents["portDrag"]) => {
    if (!this.previewConnection) return;

    const world = this.camera.screenToWorld(x, y);
    this.previewConnection.b = world;

    this.events.emit("redraw", undefined);
  };

  private startNewConnection(port: Port) {
    this.previewConnection = {
      a: getPortPosition(port),
      b: { x: 0, y: 0 },
    };
  }

  private startRelink(port: Port, conn: Connection) {
    const fixedPort = port.direction === "input" ? conn.from : conn.to;
    this.graph.disconnect(conn);
    this.portState.port = fixedPort;

    this.previewConnection = {
      a: getPortPosition(fixedPort),
      b: { x: 0, y: 0 },
    };
  }



}