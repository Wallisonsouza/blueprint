import type { EditorEvents } from "../editor/Events";
import { EventBus } from "../graph-api/EventBus";

export const nodeEvents = new EventBus<EditorEvents>();
