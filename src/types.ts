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
export type Subscribe<TPayloadMap extends EventPayloadMap> = <
  EventKey extends keyof TPayloadMap
>(
  event: EventKey | Array<EventKey>,
  consumer: Consumer<TPayloadMap[EventKey]>
) => () => Array<boolean>;
/**
 * Unsubscribe a consumer from an event.
 *
 * Returns true if consumer for given event was found and removed.
 *
 * Returns false if consumer was not found for given event.
 */
export type Unsubscribe<TPayloadMap extends EventPayloadMap> = <
  EventKey extends keyof TPayloadMap
>(
  event: EventKey | Array<EventKey>,
  consumer: Consumer<TPayloadMap[EventKey]>
) => Array<boolean>;
/**
 * Type signature for an event consumer. Called via {@link Emit}
 */
export type Consumer<T> = (payload: T) => void;
/**
 * Emit a new event with payload.
 *
 * Calling emit will invoke all consumers _synchronously_ in the
 * order they were subscribed.
 */
export type Emit<TPayloadMap extends EventPayloadMap> = <
  EventKey extends keyof TPayloadMap
>(
  event: EventKey | Array<EventKey>,
  payload: TPayloadMap[EventKey]
) => void;

export interface ILuister<TPayloadMap extends EventPayloadMap> {
  unsubscribe: Unsubscribe<TPayloadMap>;
  subscribe: Subscribe<TPayloadMap>;
  emit: Emit<TPayloadMap>;
}

export interface DefaultEventPayloadMap {
  [key: string | symbol]: unknown;
}
