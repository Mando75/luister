/**
 * Provides Luister with an expected mapping of event keys -> payload types
 * to ensure that emits and consumers are type-safe
 */
export interface EventPayloadMap {
  [key: string | symbol]: any;
}

/**
 * Subscribe to a new event.
 *
 * Consumer will be invoked _synchronously_ when event is emitted. Consumers
 * will be called in the order they subscribed.
 *
 * Returns a function that can be used to unsubscribe the created consumer
 * from the event.
 */
type Subscribe<TPayloadMap extends EventPayloadMap> = <
  EventKey extends keyof TPayloadMap
>(
  event: EventKey,
  consumer: Consumer<TPayloadMap[EventKey]>
) => () => boolean;

/**
 * Unsubscribe a consumer from an event.
 *
 * Returns true if consumer for given event was found and removed.
 *
 * Returns false if consumer was not found for given event.
 */
type Unsubscribe<TPayloadMap extends EventPayloadMap> = <
  EventKey extends keyof TPayloadMap
>(
  event: EventKey,
  consumer: Consumer<TPayloadMap[EventKey]>
) => boolean;

/**
 * Type signature for an event consumer. Called via {@link Emit}
 */
type Consumer<T> = (payload: T) => void;

/**
 * Emit a new event with payload.
 *
 * Calling emit will invoke all consumers _synchronously_ in the
 * order they were subscribed.
 */
type Emit<TPayloadMap extends EventPayloadMap> = <
  EventKey extends keyof TPayloadMap
>(
  event: EventKey,
  payload: TPayloadMap[EventKey]
) => void;

interface ILuister<TPayloadMap extends EventPayloadMap> {
  unsubscribe: Unsubscribe<TPayloadMap>;
  subscribe: Subscribe<TPayloadMap>;
  emit: Emit<TPayloadMap>;
}

/**
 * Creates a new event bus.
 * Expects a mapping of event keys to their payload types
 * @constructor
 */
export function Luister<
  TPayloadMap extends EventPayloadMap
>(): ILuister<TPayloadMap> {
  const eventMap = new Map<keyof TPayloadMap, Array<Consumer<any>>>();

  const unsubscribe: Unsubscribe<TPayloadMap> = <
    EventKey extends keyof TPayloadMap
  >(
    event: EventKey,
    consumer: Consumer<TPayloadMap[EventKey]>
  ) => {
    const subscribers = eventMap.get(event) ?? [];
    const index = subscribers.indexOf(consumer);
    if (index >= 0) {
      subscribers.splice(index, 1);
      eventMap.set(event, subscribers);
      return true;
    }
    return false;
  };

  const subscribe: Subscribe<TPayloadMap> = <
    EventKey extends keyof TPayloadMap
  >(
    event: EventKey,
    consumer: Consumer<TPayloadMap[EventKey]>
  ) => {
    const subscribers = eventMap.get(event) ?? [];
    eventMap.set(event, [...subscribers, consumer]);
    return () => unsubscribe(event, consumer);
  };

  const emit: Emit<TPayloadMap> = <EventKey extends keyof TPayloadMap>(
    event: EventKey,
    payload: TPayloadMap[EventKey]
  ) => {
    const subscribers = eventMap.get(event) ?? [];

    subscribers.forEach((subscriber) => subscriber(payload));
  };

  return { unsubscribe, subscribe, emit };
}
