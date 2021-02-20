export type EventMap = Map<string | Symbol, Array<SubscriberCallback<any>>>;
export type SubscriberCallback<T> = <T>(payload: T) => void;
export type Subscriber = <T>(
  event: string | Symbol,
  callback: SubscriberCallback<T>
) => void;
export type Emitter = <T>(event: string | Symbol, payload?: T) => void;

const createEventBus = () => {
  const eventMap: EventMap = new Map();

  const subscribe: Subscriber = (event, callback) => {
    const subscribers = eventMap.get(event);

    if (subscribers) {
      eventMap.set(event, [...subscribers, callback]);
    } else {
      eventMap.set(event, [callback]);
    }
  };

  const emit: Emitter = (event, payload) => {
    const subscribers = eventMap.get(event);

    if (!subscribers) return;

    subscribers.forEach((subscriber) => subscriber(payload));
  };

  return { emit, subscribe, eventMap };
};

export const { emit, subscribe, eventMap } = createEventBus();
