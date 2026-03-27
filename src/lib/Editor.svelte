<script lang="ts">
  import { onMount } from "svelte";
  import { graph } from "../controllers/GraphController";
  import { Camera } from "../editor/Camera";

  import { CameraController } from "../controllers/CameraController";
  import { ConnectionController } from "../controllers/ConnectionController";
  import { DragController } from "../controllers/DragController";
  import { EditorController } from "../controllers/EditorController";
  import { nodeEvents as editorEvents } from "../controllers/NodeController";
  import Blueprint from "./Blueprint.svelte";

  let cameraElement: HTMLDivElement;
  let sceneElement: HTMLDivElement;
  let gridCanvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let camera: Camera = new Camera();

  let cameraController: CameraController;
  let dragController: DragController;
  let connectionController: ConnectionController;
  let editorController: EditorController;

  window.addEventListener("resize", () => {
    gridCanvas.width = cameraElement.clientWidth;
    gridCanvas.height = cameraElement.clientHeight;
  });

  let needsRedraw = false;

  editorEvents.on("redraw", () => {
    if (!needsRedraw) {
      needsRedraw = true;
      requestAnimationFrame(() => {
        sceneElement.style.transform = `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`;
        needsRedraw = false;
      });
    }
  });

  onMount(() => {
    ctx = gridCanvas.getContext("2d")!;

    editorController = new EditorController(editorEvents, window);

    dragController = new DragController(editorEvents, camera);
    cameraController = new CameraController(editorEvents, camera);

    connectionController = new ConnectionController(
      editorEvents,
      graph,
      camera,
      ctx,
    );

    gridCanvas.width = cameraElement.clientWidth;
    gridCanvas.height = cameraElement.clientHeight;
  });
</script>

<div bind:this={cameraElement} class="camera">
  <canvas bind:this={gridCanvas} class="draw"></canvas>
  <div bind:this={sceneElement} class="scene">
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

  .scene {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: 0 0;
    z-index: 2;
  }
</style>
