import {
  Consumer,
  DefaultEventPayloadMap,
  Emit,
  EventPayloadMap,
  ILuister,
  Subscribe,
  Unsubscribe,
} from "./types";

export * from "./types";

/**
 * Creates a new event bus.
 * Expects a mapping of event keys to their payload types
 * @constructor
 */
export function Luister<
  TPayloadMap extends EventPayloadMap = DefaultEventPayloadMap
>(): ILuister<TPayloadMap> {
  const eventMap = new Map<keyof TPayloadMap, Set<Consumer<any>>>();

  const unsubscribe: Unsubscribe<TPayloadMap> = (event, consumer) => {
    const events = toArray(event);
    return events.map((e) => eventMap.get(e)?.delete(consumer) ?? false);
  };

  const subscribe: Subscribe<TPayloadMap> = (event, consumer) => {
    const events = toArray(event);
    events.forEach((e) => {
      const subscribers = eventMap.get(e) ?? new Set();
      eventMap.set(e, subscribers.add(consumer));
    });
    return () => unsubscribe(event, consumer);
  };

  const emit: Emit<TPayloadMap> = (event, payload) => {
    const subscribers = eventMap.get(event) ?? new Set();
    subscribers.forEach((subscriber) => subscriber(payload));
  };

  return { unsubscribe, subscribe, emit };
}

function toArray<T>(t: T | Array<T>): Array<T> {
  return Array.isArray(t) ? t : [t];
}
