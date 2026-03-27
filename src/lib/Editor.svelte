<script lang="ts">
  import { onMount } from "svelte";

  import { Draw } from "../editor/Draw";
  import { Editor } from "../editor/Editor";
  import Blueprint from "./Blueprint.svelte";

  let cameraElement: HTMLDivElement;
  let sceneElement: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let editor: Editor;

  window.addEventListener("resize", () => {
    canvas.width = cameraElement.clientWidth;
    canvas.height = cameraElement.clientHeight;

    editor.events.emit("redraw", undefined);
  });

  onMount(() => {
    ctx = canvas.getContext("2d")!;

    editor = new Editor(ctx);

    editor.events.on("redraw", () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      Draw.drawGrid(ctx, editor);
      Draw.drawConnections(ctx, editor);
      sceneElement.style.transform = `translate(${editor.camera.x}px, ${editor.camera.y}px) scale(${editor.camera.scale})`;
    });

    canvas.width = cameraElement.clientWidth;
    canvas.height = cameraElement.clientHeight;

    editor.events.emit("redraw", undefined);
  });
</script>

<div bind:this={cameraElement} class="camera">
  <canvas bind:this={canvas} class="draw"></canvas>
  <div bind:this={sceneElement} class="scene">
    {#if editor}
      {#each Array.from(editor.graph.nodes.values()) as node (node.id)}
        <Blueprint eventsTarget={editor.events} {node} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .camera {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
    cursor: grab;
    background: #b1b1b1;
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
