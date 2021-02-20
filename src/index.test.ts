import { emit, subscribe, eventMap } from "./";

describe("Event Emitter", () => {
  const testEventSymbol = Symbol("test:event");

  afterEach(() => {
    eventMap.clear();
  });

  describe("subscribe", () => {
    it("should add an event to the bus", () => {
      const testCallback = jest.fn();

      subscribe(testEventSymbol, testCallback);

      expect(eventMap.get(testEventSymbol)).toEqual([testCallback]);
    });

    it("should append multiple callbacks to the same event symbol", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      subscribe(testEventSymbol, callback1);
      subscribe(testEventSymbol, callback2);

      expect(eventMap.get(testEventSymbol)).toEqual([callback1, callback2]);
    });

    it("should invoke the subscribers when event is emitted", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      subscribe(testEventSymbol, callback1);
      subscribe(testEventSymbol, callback2);

      emit(testEventSymbol);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });
});
