// 💭 Pub-sub/Mediator Pattern with Async Support

type Listener<T = any, R = void> = (data: T) => R | Promise<R>;

export default class EventBus {
  private events: Record<string, Array<Listener<any, any>>> = {};

  /**
   * Register a listener for a specific event.
   * @param eventName - The name of the event.
   * @param fn - The callback function to register.
   */
  on<T, R = void>(eventName: string, fn: Listener<T, R>): void {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  /**
   * Unregister a listener for a specific event.
   * @param eventName - The name of the event.
   * @param fn - The callback function to remove.
   */
  off<T, R = void>(eventName: string, fn: Listener<T, R>): void {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (listener) => listener !== fn
      );
    }
  }

  /**
   * Emit an event, calling all listeners registered for it.
   * Supports awaiting asynchronous listeners.
   * @param eventName - The name of the event.
   * @param data - The data to pass to the listeners (optional).
   * @returns A promise that resolves when all listeners have finished.
   */
  async emit<T, R = void>(eventName: string, data?: T): Promise<R[]> {
    if (this.events[eventName]) {
      // Await all listener executions (in parallel)
      return await Promise.all(this.events[eventName].map((fn) => fn(data)));
    }
    return [];
  }
}
