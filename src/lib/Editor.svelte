<script lang="ts">
  import * as PIXI from "pixi.js";
  import { onMount } from "svelte";

  import { Draw } from "../editor/Draw";
  import { Editor } from "../editor/Editor";
  import { loadGraph } from "../editor/Save";
  import { SceneSerealizer } from "../graph-api/GraphSerealizer";
  import Blueprint from "./Blueprint.svelte";

  let cameraElement: HTMLDivElement;
  let sceneElement: HTMLDivElement;

  let app: PIXI.Application;

  let gridLayer: PIXI.Graphics;
  let connectionLayer: PIXI.Graphics;
  let flowLayer: PIXI.Graphics;

  let nodes: any[] = [];
  let editor: Editor;

  onMount(async () => {
    app = new PIXI.Application();

    await app.init({
      resizeTo: cameraElement,
      antialias: true,
      backgroundAlpha: 0,
    });

    cameraElement.appendChild(app.canvas);

    gridLayer = new PIXI.Graphics();
    connectionLayer = new PIXI.Graphics();
    flowLayer = new PIXI.Graphics();

    app.stage.addChild(gridLayer);
    app.stage.addChild(connectionLayer);
    app.stage.addChild(flowLayer);
    editor = new Editor(cameraElement);

    const json = await loadGraph("test");
    const scene = SceneSerealizer.deserialize(json);
    editor.loadScene(scene);

    nodes = Array.from(editor.scene.graph.nodes.values());

    editor.events.on("redraw", draw);

    let time: number = 0;

    app.ticker.add((delta) => {
      time += delta.deltaTime * 0.01;

      flowLayer.clear();
      Draw.drawFlows(flowLayer, editor, time);
    });

    editor.events.emit("redraw", undefined);
  });

  function draw() {
    gridLayer.clear();
    connectionLayer.clear();

    Draw.drawGridPixi(gridLayer, editor, app.renderer);
    Draw.drawConnections(connectionLayer, editor);
    Draw.drawPreviewConnection(connectionLayer, editor);

    connectionLayer.position.set(editor.scene.camera.x, editor.scene.camera.y);
    connectionLayer.scale.set(editor.scene.camera.scale);

    flowLayer.position.set(editor.scene.camera.x, editor.scene.camera.y);
    flowLayer.scale.set(editor.scene.camera.scale);

    sceneElement.style.transform = `
      translate(${editor.scene.camera.x}px, ${editor.scene.camera.y}px)
      scale(${editor.scene.camera.scale})
    `;
  }
</script>

<div bind:this={cameraElement} class="camera">
  <div bind:this={sceneElement} class="scene">
    {#if editor}
      {#each nodes as node (node.id)}
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

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .save {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
  }

  .scene {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: 0 0;
    z-index: 2;
  }
</style>
