// 💭 Pub-sub/Mediator Pattern

type Listener<T = any> = (data: T) => void;

class EventBus {
  private events: Record<string, Array<Listener>> = {};

  /**
   * Register a listener for a specific event.
   * @param eventName - The name of the event.
   * @param fn - The callback function to register.
   */
  on<T>(eventName: string, fn: Listener<T>): void {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  /**
   * Unregister a listener for a specific event.
   * @param eventName - The name of the event.
   * @param fn - The callback function to remove.
   */
  off<T>(eventName: string, fn: Listener<T>): void {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (listener) => listener !== fn
      );
    }
  }

  /**
   * Emit an event, calling all listeners registered for it.
   * @param eventName - The name of the event.
   * @param data - The data to pass to the listeners (optional).
   */
  emit<T>(eventName: string, data?: T): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => fn(data));
    }
  }
}

const GlobalEventBus = new EventBus();

export default GlobalEventBus;