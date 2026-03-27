import type { NodeEditorEvents } from "../Events";
import { EventBus } from "../graph-api/EventBus";

export const nodeEvents = new EventBus<NodeEditorEvents>();
