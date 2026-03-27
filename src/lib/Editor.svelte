<script lang="ts">
  import { onMount } from "svelte";
  import { graph } from "../controllers/GraphController";
  import { Camera } from "../editor/Camera";

  import { DragController } from "../controllers/DragController";
  import { nodeEvents as editorEvents } from "../controllers/NodeController";
  import { drawBezier, type PreviewConnection } from "../editor/Draw";
  import type { Position } from "../graph-api/BlueprintNode";
  import type { Connection, Port } from "../graph-api/Types";
  import Blueprint from "./Blueprint.svelte";

  let camera: HTMLDivElement;

  let scene: HTMLDivElement;
  let gridCanvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let cameraController: Camera;

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  let isDragging = false;
  let startX = 0;
  let startY = 0;

  const dragController: DragController = new DragController(editorEvents);

  window.addEventListener("resize", () => {
    gridCanvas.width = camera.clientWidth;
    gridCanvas.height = camera.clientHeight;

    requestRedraw();
  });

  function requestRedraw() {
    updateScene();
    drawConnections();
  }

  function getPortPosition(port: Port): Position {
    return {
      x: port.node.position.x + port.offset!.x,
      y: port.node.position.y + port.offset!.y,
    };
  }

  // --- PAN ---
  function onMouseDownCamera(e: MouseEvent) {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    camera.style.cursor = "grabbing";
  }

  function onMouseMoveWindow(e: MouseEvent) {
    if (!isDragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    requestRedraw();
  }

  function onMouseUpWindow() {
    isDragging = false;
    camera.style.cursor = "grab";
    previewConnection = null;

    requestRedraw();
    if (!portState.port) return;
    if (!hoveredPort) return;

    const source =
      portState.port.direction === "output" ? portState.port : hoveredPort;

    const target =
      portState.port.direction === "input" ? portState.port : hoveredPort;

    if (source !== target) {
      graph.connect(source, target);
    }

    portState = { port: null, connection: null };

    console.log(previewConnection);
    drawConnections();
  }

  // --- ZOOM ---
  function onWheelCamera(e: WheelEvent) {
    e.preventDefault();
    const zoomSensitivity = 0.0015;
    const newScale = Math.min(
      Math.max(0.5, scale - e.deltaY * zoomSensitivity),
      3,
    );

    const rect = camera.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    offsetX -= (mx - offsetX) * (newScale / scale - 1);
    offsetY -= (my - offsetY) * (newScale / scale - 1);

    scale = newScale;
    requestRedraw();
  }

  // --- UPDATE SCENE ---
  function updateScene() {
    scene.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  editorEvents.on("nodeMove", () => {
    requestRedraw();
  });

  onMount(() => {
    cameraController = new Camera(camera);
    ctx = gridCanvas.getContext("2d")!;

    camera.addEventListener("mousedown", onMouseDownCamera);
    camera.addEventListener("wheel", onWheelCamera, { passive: false });
    window.addEventListener("mousemove", onMouseMoveWindow);
    window.addEventListener("mouseup", onMouseUpWindow);

    gridCanvas.width = camera.clientWidth;
    gridCanvas.height = camera.clientHeight;

    requestRedraw();
  });

  let previewConnection: PreviewConnection | null = null;

  function drawConnections() {
    if (!ctx) return;
    ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

    graph.connections.forEach((conn) => {
      const a = cameraController.worldToScreen(getPortPosition(conn.from));
      const b = cameraController.worldToScreen(getPortPosition(conn.to));

      drawBezier(ctx, a, b, "rgba(50, 50, 50, 10)", 2, false);
    });

    if (previewConnection) {
      const a = cameraController.worldToScreen(previewConnection.a);

      const b = cameraController.worldToScreen(previewConnection.b);

      drawBezier(ctx, a, b, "blue", 2, true);
    }
  }

  function startNewConnection(port: Port) {
    previewConnection = {
      a: getPortPosition(port),
      b: { x: 0, y: 0 },
    };
  }

  function startRelink(port: Port, conn: Connection) {
    const fixedPort = port.direction === "input" ? conn.from : conn.to;

    graph.disconnect(conn);

    portState.port = fixedPort;

    previewConnection = {
      a: getPortPosition(fixedPort),
      b: { x: 0, y: 0 },
    };
  }

  interface PortState {
    port: Port | null;
    connection: Connection | null;
    isFrom?: boolean;
  }
  let portState: PortState = {
    port: null,
    connection: null,
  };

  let hoveredPort: Port | null = null;

  editorEvents.on("portEnter", ({ port }) => {
    hoveredPort = port;
  });

  editorEvents.on("portLeave", ({ port }) => {
    if (hoveredPort === port) {
      hoveredPort = null;
    }
  });

  editorEvents.on("portDown", ({ port, event }) => {
    const conn = graph.getFirstConnectionByPort(port);

    portState = {
      port,
      connection: conn,
      isFrom: port.direction === "output",
    };

    if (event.ctrlKey && conn) {
      startRelink(port, conn);
    } else {
      startNewConnection(port);
    }
  });

  editorEvents.on("portDrag", ({ port, x, y }) => {
    if (!previewConnection) return;

    const world = cameraController.screenToWorld(x, y);

    previewConnection.b = world;

    drawConnections();
  });
</script>

<div bind:this={camera} class="camera">
  <canvas bind:this={gridCanvas} class="draw"></canvas>
  <div bind:this={scene} class="scene">
    {#each Array.from(graph.nodes.values()) as node (node.id)}
      <Blueprint eventsTarget={editorEvents} {node} />
    {/each}
  </div>
</div>

<style>
  .camera {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
    cursor: grab;
    background: #f0f0f0;
  }

  .draw {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .connections {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .scene {
    position: absolute;
    width: 2000px;
    height: 2000px;
    transform-origin: 0 0;
    z-index: 2;
  }
</style>
