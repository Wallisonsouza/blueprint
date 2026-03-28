<script lang="ts">
  import { onMount } from "svelte";
  import type { EditorEvents } from "../editor/Events";
  import type { BlueprintNode } from "../graph-api/BlueprintNode";
  import type { EventBus } from "../graph-api/EventBus";

  export let node: BlueprintNode;
  let nodeEl: HTMLDivElement;
  export let eventsTarget: EventBus<EditorEvents>;

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

      el.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        eventsTarget.emit("portDown", { port, event: e });
      });
    });
  });

  function onMouseDown(e: MouseEvent) {
    e.stopPropagation();

    eventsTarget.emit("nodeDown", {
      node,
      event: e,
    });
  }

  function updatePosition() {
    if (!nodeEl) return;
    nodeEl.style.left = node.position.x + "px";
    nodeEl.style.top = node.position.y + "px";
  }

  eventsTarget.on("nodeMove", () => {
    updatePosition();
    eventsTarget.emit("redraw", undefined);
  });
</script>

<div
  role="button"
  tabindex="0"
  bind:this={nodeEl}
  class="node"
  on:mousedown={onMouseDown}
>
  <div class="node">
    <div class="node-header {node.category || 'default'}">{node.type}</div>

    <div class="exec-ports">
      {#each Array(Math.max(node.inputs.filter((p) => p.type === "exec").length, node.outputs.filter((p) => p.type === "exec").length)) as _, i}
        <div class="port-row">
          <div class="left">
            {#if node.inputs.filter((p) => p.type === "exec")[i]}
              <div
                class="port input-port exec"
                id={node.inputs.filter((p) => p.type === "exec")[i].id}
              ></div>

              <div class="port-label">
                {node.inputs.filter((p) => p.type === "exec")[i].label}
              </div>
            {/if}
          </div>
          <div class="right">
            {#if node.outputs.filter((p) => p.type === "exec")[i]}
              <div class="port-label">
                {node.outputs.filter((p) => p.type === "exec")[i].label}
              </div>
              <div
                class="port output-port exec"
                id={node.outputs.filter((p) => p.type === "exec")[i].id}
              ></div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Data ports -->
    <div class="data-ports">
      {#each Array(Math.max(node.inputs.filter((p) => p.type !== "exec").length, node.outputs.filter((p) => p.type !== "exec").length)) as _, i}
        <div class="port-row">
          <div class="left">
            {#if node.inputs.filter((p) => p.type !== "exec")[i]}
              <div
                class="port input-port data"
                id={node.inputs.filter((p) => p.type !== "exec")[i].id}
              ></div>

              <div class="port-label">
                {node.inputs.filter((p) => p.type !== "exec")[i].label}
              </div>
            {/if}
          </div>
          <div class="right">
            {#if node.outputs.filter((p) => p.type !== "exec")[i]}
              <div class="port-label">
                {node.outputs.filter((p) => p.type !== "exec")[i].label}
              </div>

              <div
                class="port output-port data"
                id={node.outputs.filter((p) => p.type !== "exec")[i].id}
              ></div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .node-header.event {
    background: #e74c3c;
  }

  .node-header.logic {
    background: #9b59b6;
  }

  .node-header.math {
    background: #3498db;
  }

  .node-header.variable {
    background: #2ecc71;
  }

  .node-header.function {
    background: #f1c40f;
    color: #2c3e50;
  }

  .node-header.flow {
    background: #e67e22;
  }

  .node-header.data {
    background: #323232;
  }

  .node-header.system {
    background: #34495e;
  }

  .node-header.input {
    background: #8e5a2b;
  }

  .node-header.physics {
    background: #1abc9c;
  }

  .node-header.default {
    background: #7f8c8d;
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
    overflow: visible;
    font-family: sans-serif;
    width: 140px;
    z-index: 999;
  }

  .node-header {
    padding: 4px 8px;
    font-weight: bold;
    text-align: center;
    border-radius: 4px 4px 0px 0px;
  }

  .port-row {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 28px;
  }

  .left,
  .right {
    height: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .port.input-port.exec,
  .port.output-port.exec {
    background: #ffffff;
    width: 16px;
    height: 16px;
    border-radius: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .port.input-port.data,
  .port.output-port.data {
    background: #03a9f4;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .port-label {
    height: 100%;
    display: flex;
    align-items: center;
    pointer-events: none;
    font-size: 12px;
  }
</style>
