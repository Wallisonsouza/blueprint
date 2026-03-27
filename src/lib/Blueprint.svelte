<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { BlueprintNode } from "../graph-api/BlueprintNode";
  import type { EventBus } from "../graph-api/EventBus";
    import type { NodeEditorEvents } from "../editor/Events";

  export let node: BlueprintNode;
  export let scale = 1;

  let nodeEl: HTMLDivElement;

  let isDragging = false;
  let dragStartMouseX = 0;
  let dragStartMouseY = 0;
  let dragStartNodeX = 0;
  let dragStartNodeY = 0;

  export let eventsTarget: EventBus<NodeEditorEvents>;

  onMount(() => {
    updatePosition();

    node.inputs.concat(node.outputs).forEach((port) => {
      const el = document.getElementById(port.id);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const nodeRect = nodeEl.getBoundingClientRect();

      port.offset = {
        x: rect.left - nodeRect.left + rect.width / 2,
        y: rect.top - nodeRect.top + rect.height / 2,
      };

      el.addEventListener("mouseenter", () => {
        eventsTarget.emit("portEnter", { port });
      });

      el.addEventListener("mouseleave", () => {
        eventsTarget.emit("portLeave", { port });
      });

      let isPortDragging = false;

      el.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        isPortDragging = true;

        eventsTarget.emit("portDown", { port, event: e });

        window.addEventListener("mousemove", onPortDragMove);
        window.addEventListener("mouseup", onPortDragEnd);
      });

      function onPortDragMove(e: MouseEvent) {
        if (!isPortDragging) return;
        eventsTarget.emit("portDrag", {
          port,
          x: e.clientX,
          y: e.clientY,
        });
      }

      function onPortDragEnd(e: MouseEvent) {
        if (isPortDragging) {
          isPortDragging = false;

          eventsTarget.emit("portUp", { port });

          window.removeEventListener("mousemove", onPortDragMove);
          window.removeEventListener("mouseup", onPortDragEnd);
        }
      }
    });
  });

  function onMouseDown(e: MouseEvent) {
    e.stopPropagation();
    isDragging = true;

    dragStartNodeX = node.position.x;
    dragStartNodeY = node.position.y;
    dragStartMouseX = e.clientX;
    dragStartMouseY = e.clientY;

    nodeEl.style.cursor = "grabbing";

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging) return;

    const dx = (e.clientX - dragStartMouseX) / scale;
    const dy = (e.clientY - dragStartMouseY) / scale;

    node.position.x = dragStartNodeX + dx;
    node.position.y = dragStartNodeY + dy;

    updatePosition();
    eventsTarget.emit("nodeMove", { node: node, event: e });
  }

  function onMouseUp() {
    if (isDragging) {
      isDragging = false;
      nodeEl.style.cursor = "pointer";

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
  }

  function updatePosition() {
    if (!nodeEl) return;
    nodeEl.style.left = node.position.x + "px";
    nodeEl.style.top = node.position.y + "px";
  }

  onDestroy(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  });
</script>

<div
  role="button"
  tabindex="0"
  bind:this={nodeEl}
  class="node"
  on:mousedown={onMouseDown}
>
  <div class="node-header">{node.type}</div>

  <div class="exec-ports">
    {#each node.outputs.filter((p) => p.type === "exec") as port}
      <div class="port exec-port" id={port.id}>{port.label}</div>
    {/each}
  </div>

  <div class="data-ports">
    <div class="inputs">
      <!-- <input class="input-data" type="number" /> -->
      {#each node.inputs.filter((p) => p.type !== "exec") as port}
        <div class="port data-port" id={port.id}>{port.label}</div>
      {/each}
    </div>
    <div class="outputs">
      {#each node.outputs.filter((p) => p.type !== "exec") as port}
        <div class="port data-port" id={port.id}>{port.label}</div>
      {/each}
    </div>
  </div>
</div>

<style>
  .input-data {
    width: 100%;
    padding: 4px 6px;

    background: #1f2a38;
    color: #ecf0f1;

    border: 1px solid #3b4a5a;
    border-radius: 4px;

    font-size: 12px;
    outline: none;

    transition: all 0.15s ease;
  }

  /* focus = destaque suave */
  .input-data:focus {
    border-color: #3498db;
    background: #243447;
  }

  /* remove setinhas feias do number */
  .input-data::-webkit-outer-spin-button,
  .input-data::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .input-data[type="number"] {
    -moz-appearance: textfield;
  }
  .node {
    position: absolute;
    background: #2c3e50;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    user-select: none;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: sans-serif;
    width: 140px;
    z-index: 999;
  }

  .node-header {
    background: #96c30e;
    padding: 4px 8px;
    font-weight: bold;
    text-align: center;
  }

  .exec-ports {
    display: flex;
    gap: 4px;
    padding: 4px;
    justify-content: flex-start;
    background: #3b4a5a;
  }

  .data-ports {
    display: flex;
    justify-content: space-between;
    background: #3b4a5a;
    padding: 4px;
  }

  .inputs,
  .outputs {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 2px;
  }

  .port {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    color: white;
    white-space: nowrap;
  }

  .exec-port {
    background: #e67e22;
  }

  .data-port {
    background: #3498db;
  }
</style>
