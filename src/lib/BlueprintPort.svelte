<script lang="ts">
  import { onMount } from "svelte";
  import type { EditorEvents } from "../editor/Events";
  import type { EventBus } from "../graph-api/EventBus";
  import type { Port as PortType } from "../graph-api/Types";

  export let port: PortType;
  export let eventsTarget: EventBus<EditorEvents>;

  let el: HTMLDivElement;

  onMount(() => {
    port.el = el;

    el.addEventListener("mouseenter", () =>
      eventsTarget.emit("portEnter", { port }),
    );
    el.addEventListener("mouseleave", () =>
      eventsTarget.emit("portLeave", { port }),
    );
    el.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      eventsTarget.emit("portDown", { port, event: e });
    });
  });
</script>

<div class="port {port.direction}-{port.type}" bind:this={el}></div>
<div class="port-label">{port.label}</div>

<style>
  .port.input-exec,
  .port.output-exec {
    background: #fff;
    border-radius: 25%;
    width: 16px;
    height: 16px;
  }
  .port.input-data,
  .port.output-data {
    background: #03a9f4;
    border-radius: 50%;
    width: 16px;
    height: 16px;
  }
  .port-label {
    font-size: 12px;
    pointer-events: none;
    display: flex;
    align-items: center;
  }
</style>
