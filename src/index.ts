export type EventMap = Map<string | Symbol, Array<SubscriberCallback<any>>>;
export type SubscriberCallback<T> = <T>(payload: T) => void;
export type Subscribe = <T>(
  event: string | Symbol,
  callback: SubscriberCallback<T>
) => Unsubscriber;
export type Unsubscribe = <T>(event: string | Symbol, callback: SubscriberCallback<T>) => boolean;
export type Unsubscriber = () => ReturnType<Unsubscribe>
export type Emitter = <T>(event: string | Symbol, payload?: T) => void;

export const createEventBus = () => {
  /**
   * Tracks the registered events and their subscribers
   */
  const eventMap: EventMap = new Map();

  const subscribe: Subscribe = (event, callback) => {
    const subscribers = eventMap.get(event) ?? [];
    eventMap.set(event, [...subscribers, callback]);
    return () => unsubscribe(event, callback)
  };

  const unsubscribe: Unsubscribe = (event, callback) => {
    const subscribers = eventMap.get(event) ?? []
    const index = subscribers.indexOf(callback)
    if (index >= 0) {
      subscribers.splice(index, 1)
      eventMap.set(event, subscribers)
      return true
    } else {
      return false
    }
  }

  const emit: Emitter = (event, payload) => {
    const subscribers = eventMap.get(event) ?? [];

    subscribers.forEach((subscriber) => subscriber(payload));
  };

  return { emit, subscribe, unsubscribe, eventMap };
};

export const { emit, subscribe, unsubscribe, eventMap } = createEventBus();
