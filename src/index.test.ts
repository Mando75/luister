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
  });

  describe("emit", () => {
    it("should invoke the subscribers when event is emitted", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      subscribe(testEventSymbol, callback1);
      subscribe(testEventSymbol, callback2);

      emit(testEventSymbol);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it("should pass the same payload to each subscriber", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const payload = Symbol("payload");

      subscribe(testEventSymbol, callback1);
      subscribe(testEventSymbol, callback2);

      emit(testEventSymbol, payload);
      expect(callback1).toHaveBeenCalledWith(payload);
      expect(callback2).toHaveBeenCalledWith(payload);
    });

    it("should do nothing if no subscribers exist for an event", () => {
      const callback = jest.fn();
      subscribe(testEventSymbol, callback);
      emit(Symbol("ignored:event"), "payload");
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
