import type { NodeEditorEvents } from "../editor/Events";
import { EventBus } from "../graph-api/EventBus";

export const nodeEvents = new EventBus<NodeEditorEvents>();
