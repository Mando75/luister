/**
 * Tracks event -> consumer mappings.
 *
 * Only exported for advanced use cases
 */
export type EventMap = Map<string | Symbol, Array<Consumer<any>>>;

/**
 * Subscribe to a new event.
 *
 * Consumer will be invoked _synchronously_ when event is emitted.
 *
 * Returns a function that can be used to unsubscribe the created consumer
 * from the event.
 */
export type Subscribe = <T>(
  event: string | Symbol,
  consumer: Consumer<T>
) => Unsubscriber;
export type Consumer<T> = <T>(payload: T) => void;

/**
 * Unsubscribe a consumer from an event.
 *
 * Returns true if consumer for given event was found and removed.
 *
 * Returns false if consumer was not found for given event.
 */
export type Unsubscribe = <T>(
  event: string | Symbol,
  consumer: Consumer<T>
) => boolean;
export type Unsubscriber = () => ReturnType<Unsubscribe>;

/**
 * Emit a new event with an optional payload.
 *
 * Calling emit will invoke all consumers _synchronously_ in the
 * order they were subscribed.
 */
export type Emit = <T>(event: string | Symbol, payload?: T) => void;

/**
 * Emit a new event with an optional payload.
 *
 * Calling emitAsync will invoke all consumers _asynchronously_ (via Promise) and
 * return the result of calling Promise.allSettled on the promisified consumers.
 */
export type EmitAsync = <T>(
  event: string | Symbol,
  payload?: T
) => Promise<Array<PromiseSettledResult<void>>>;

/**
 * Create a new event bus. Will return a new
 * eventMap and it's associated emit/subscribe functions
 *
 * Useful if you wish to isolate groups of events from each other
 */
export function Luister() {
  const eventMap: EventMap = new Map();

  const subscribe: Subscribe = (event, consumer) => {
    const subscribers = eventMap.get(event) ?? [];
    eventMap.set(event, [...subscribers, consumer]);
    return () => unsubscribe(event, consumer);
  };

  const unsubscribe: Unsubscribe = (event, consumer) => {
    const subscribers = eventMap.get(event) ?? [];
    const index = subscribers.indexOf(consumer);
    if (index >= 0) {
      subscribers.splice(index, 1);
      eventMap.set(event, subscribers);
      return true;
    } else {
      return false;
    }
  };

  const emit: Emit = (event, payload) => {
    const subscribers = eventMap.get(event) ?? [];

    subscribers.forEach((subscriber) => subscriber(payload));
  };

  const emitAsync: EmitAsync = async (event, payload) => {
    const subscribers = eventMap.get(event) ?? [];

    const promises = subscribers.map(
      (subscriber) =>
        new Promise<void>((resolve, reject) => {
          try {
            subscriber(payload);
            resolve();
          } catch (e) {
            reject(e);
          }
        })
    );

    return await Promise.allSettled(promises);
  };

  return { emit, emitAsync, subscribe, unsubscribe, eventMap };
}

const globalBus = Luister();

/**
 * Emit an event on the global event bus
 *
 * See {@link Emit}
 */
export const emit: Emit = globalBus.emit;

/**
 * Emit an event and call the subscribers asynchronously via
 * promises
 *
 * See {@link EmitAsync}
 */
export const emitAsync: EmitAsync = globalBus.emitAsync;

/**
 * Subscribe to an event on the global event bus
 *
 * See {@link Subscribe}
 */
export const subscribe: Subscribe = globalBus.subscribe;

/**
 * Unsubscribe from an event on the global event bus
 *
 * See {@link Unsubscribe}
 */
export const unsubscribe: Unsubscribe = globalBus.unsubscribe;

/**
 * Event -> Consumer mapping of the global event bus
 *
 * See {@link EventMap}
 */
export const eventMap: EventMap = globalBus.eventMap;
