export type EventMap = Map<string | Symbol, Array<Consumer<any>>>;
export type Consumer<T> = <T>(payload: T) => void;
export type Subscribe = <T>(
  event: string | Symbol,
  consumer: Consumer<T>
) => Unsubscriber;
export type Unsubscribe = <T>(
  event: string | Symbol,
  consumer: Consumer<T>
) => boolean;
export type Unsubscriber = () => ReturnType<Unsubscribe>;
export type Emitter = <T>(event: string | Symbol, payload?: T) => void;

/**
 * Create a new event bus. Will return a new
 * eventMap and it's associated emit/subscribe functions
 *
 * Useful if you wish to isolate groups events from each other
 */
export default function Luister() {
  /**
   * Tracks the registered events and their subscribers.
   */
  const eventMap: EventMap = new Map();

  /**
   * Subscribe to a new event.
   *
   * Consumer will be invoked _synchronously_ when event is emitted.
   *
   * Returns a function that can be used to unsubscribe the created consumer
   * from the event.
   *
   * @param {string | Symbol} event
   * @param {Consumer} consumer
   * @return Unsubscriber
   */
  const subscribe: Subscribe = (event, consumer) => {
    const subscribers = eventMap.get(event) ?? [];
    eventMap.set(event, [...subscribers, consumer]);
    return () => unsubscribe(event, consumer);
  };

  /**
   * Unsubscribe a consumer from an event.
   *
   * Returns true if consumer for given event was found and removed.
   *
   * Returns false if consumer was not found for given event.
   *
   * @param event
   * @param consumer
   * @return boolean
   */
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

  /**
   * Emit a new event with an optional payload.
   *
   * Calling emit will invoke all consumers _synchronously_ in the
   * order they were subscribed.
   *
   * @param event
   * @param payload
   */
  const emit: Emitter = (event, payload) => {
    const subscribers = eventMap.get(event) ?? [];

    subscribers.forEach((subscriber) => subscriber(payload));
  };

  return { emit, subscribe, unsubscribe, eventMap };
}

export const { emit, subscribe, unsubscribe, eventMap } = Luister();
