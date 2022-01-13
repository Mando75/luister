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
  const eventMap = new Map<keyof TPayloadMap, Array<Consumer<any>>>();

  const unsubscribe: Unsubscribe<TPayloadMap> = (event, consumer) => {
    const events = toArray(event);
    return events.map((e) => {
      const subscribers = eventMap.get(e) ?? [];
      const index = subscribers.indexOf(consumer);
      if (index >= 0) {
        subscribers.splice(index, 1);
        eventMap.set(e, subscribers);
        return true;
      }
      return false;
    });
  };

  const subscribe: Subscribe<TPayloadMap> = (event, consumer) => {
    const events = toArray(event);
    events.forEach((e) => {
      const subscribers = eventMap.get(e) ?? [];
      eventMap.set(e, [...subscribers, consumer]);
    });
    return () => unsubscribe(event, consumer);
  };

  const emit: Emit<TPayloadMap> = (event, payload) => {
    const subscribers = eventMap.get(event) ?? [];
    subscribers.forEach((subscriber) => subscriber(payload));
  };

  return { unsubscribe, subscribe, emit };
}

function toArray<T>(t: T | Array<T>): Array<T> {
  return Array.isArray(t) ? t : [t];
}
