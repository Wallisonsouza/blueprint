export class EventBus<T extends Record<string, any>> {
  private listeners: {
    [K in keyof T]?: Array<(payload: T[K]) => void>;
  } = {};

  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event]!.push(handler);

    return () => {
      this.off(event, handler);
    };
  }

  off<K extends keyof T>(event: K, handler: (payload: T[K]) => void) {
    const arr = this.listeners[event];
    if (!arr) return;

    this.listeners[event] = arr.filter((h) => h !== handler);
  }

  emit<K extends keyof T>(event: K, payload: T[K]) {
    this.listeners[event]?.forEach((handler) => handler(payload));
  }
}