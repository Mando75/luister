import { emit, eventMap, subscribe, unsubscribe } from "./";

describe("Luister", () => {
  const TEST_EVENT = Symbol("test:event");
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  const callback3 = jest.fn();

  const payload = {
    a: Symbol("payload"),
    b: "payload",
    c: 0,
  };

  afterEach(() => {
    eventMap.clear();
    jest.resetAllMocks();
  });

  describe("subscribe", () => {
    it("should add an event to the bus", () => {
      subscribe(TEST_EVENT, callback1);

      expect(eventMap.get(TEST_EVENT)).toStrictEqual([callback1]);
    });

    it("should append multiple callbacks to the same event symbol", () => {
      subscribe(TEST_EVENT, callback1);
      subscribe(TEST_EVENT, callback2);

      expect(eventMap.get(TEST_EVENT)).toStrictEqual([callback1, callback2]);
    });

    it("should return an unsubscriber that removes the callback from the event map", () => {
      subscribe(TEST_EVENT, callback1);
      const unsubscribeCallback2 = subscribe(TEST_EVENT, callback2);
      subscribe(TEST_EVENT, callback3);

      expect(eventMap.get(TEST_EVENT)).toStrictEqual([
        callback1,
        callback2,
        callback3,
      ]);

      const success = unsubscribeCallback2();

      expect(success).toBeTruthy();
      expect(eventMap.get(TEST_EVENT)).toStrictEqual([callback1, callback3]);
    });

    it("should not call an event when returned unsubscriber is invoked", () => {
      subscribe(TEST_EVENT, callback1);
      const unsubscribeCallback2 = subscribe(TEST_EVENT, callback2);

      emit(TEST_EVENT, payload);

      const success = unsubscribeCallback2();

      expect(success).toBeTruthy();
      emit(TEST_EVENT, payload);

      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe("emit", () => {
    it("should invoke the subscribers when event is emitted", () => {
      subscribe(TEST_EVENT, callback1);
      subscribe(TEST_EVENT, callback2);

      emit(TEST_EVENT);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it("should pass the same payload to each subscriber", () => {
      subscribe(TEST_EVENT, callback1);
      subscribe(TEST_EVENT, callback2);

      emit(TEST_EVENT, payload);
      expect(callback1).toHaveBeenCalledWith(payload);
      expect(callback2).toHaveBeenCalledWith(payload);
    });

    it("should do nothing if no subscribers exist for an event", () => {
      subscribe(TEST_EVENT, callback1);
      emit(Symbol("ignored:event"), payload);
      expect(callback1).not.toHaveBeenCalled();
    });
  });

  describe("unsubscribe", () => {
    it("should return true if callback was found and removed", () => {
      subscribe(TEST_EVENT, callback1);
      subscribe(TEST_EVENT, callback2);

      expect(unsubscribe(TEST_EVENT, callback2)).toBeTruthy();
    });

    it("should return false if callback was not found for event", () => {
      subscribe(TEST_EVENT, callback1);
      expect(unsubscribe(TEST_EVENT, callback2)).toBeFalsy();
    });

    it("should remove the callback from the event map", () => {
      subscribe(TEST_EVENT, callback1);
      subscribe(TEST_EVENT, callback2);
      subscribe(TEST_EVENT, callback3);

      expect(eventMap.get(TEST_EVENT)).toStrictEqual([
        callback1,
        callback2,
        callback3,
      ]);

      unsubscribe(TEST_EVENT, callback2);

      expect(eventMap.get(TEST_EVENT)).toStrictEqual([callback1, callback3]);
    });

    it("should not publish an event to an unsubbed subscriber", () => {
      subscribe(TEST_EVENT, callback1);
      subscribe(TEST_EVENT, callback2);

      emit(TEST_EVENT, payload);

      unsubscribe(TEST_EVENT, callback2);

      emit(TEST_EVENT, payload);

      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it("should return false if event was not registered", () => {
      expect(eventMap.get(TEST_EVENT)).toBeUndefined();

      expect(unsubscribe(TEST_EVENT, callback1)).toBeFalsy();
    });
  });
});
