import { Luister } from "./index";

describe("Luister", () => {
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  const callback3 = jest.fn();

  const foo = Symbol("foo");

  interface TestEventMapping {
    [foo]: string;
    bar: number;
    baz: {
      qux: string;
    };
  }

  let bus = Luister<TestEventMapping>();

  const payloads: TestEventMapping = {
    [foo]: "lorem",
    bar: 69,
    baz: {
      qux: "ipsum",
    },
  };

  afterEach(() => {
    bus = Luister<TestEventMapping>();
    jest.resetAllMocks();
  });

  describe("subscribing to events", () => {
    it("should call the consumer when event is emitted", () => {
      bus.subscribe(foo, callback1);
      bus.emit(foo, payloads[foo]);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback1).toHaveBeenCalledWith(payloads[foo]);
    });

    it("should call all consumers when an event is emitted", () => {
      bus.subscribe("bar", callback1);
      bus.subscribe("bar", callback2);
      bus.subscribe("bar", callback3);
      bus.emit("bar", payloads.bar);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback1).toHaveBeenCalledWith(payloads.bar);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledWith(payloads.bar);
      expect(callback3).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledWith(payloads.bar);
    });

    it("should not invoke consumers for events that were not emitted", () => {
      bus.subscribe(foo, callback1);
      bus.subscribe("bar", callback2);
      bus.subscribe("baz", callback3);

      bus.emit(foo, payloads[foo]);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback1).toHaveBeenCalledWith(payloads[foo]);
      expect(callback2).not.toHaveBeenCalled();
      expect(callback3).not.toHaveBeenCalled();
    });
  });

  it("should be able to subscribe to multiple events", () => {
    bus.subscribe([foo, "bar"], callback1);
    bus.emit(foo, payloads[foo]);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenLastCalledWith(payloads[foo]);
    bus.emit("bar", payloads.bar);
    expect(callback1).toHaveBeenCalledTimes(2);
    expect(callback1).toHaveBeenLastCalledWith(payloads.bar);
  });

  describe("unsubscribing from events", () => {
    describe("using subscribe return value", () => {
      it("should not call the unsubbed consumer", () => {
        const unsub = bus.subscribe("baz", callback1);
        bus.emit("baz", payloads.baz);
        unsub();
        bus.emit("baz", payloads.baz);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledWith(payloads.baz);
      });

      it("should call remaining subscribed consumers", () => {
        const unsub = bus.subscribe("bar", callback1);
        bus.subscribe("bar", callback2);
        bus.subscribe("bar", callback3);

        bus.emit("bar", payloads.bar);
        unsub();
        bus.emit("bar", payloads.bar);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(2);
        expect(callback3).toHaveBeenCalledTimes(2);
      });

      it("should unsubscribe the consumer from all events", () => {
        const unsub = bus.subscribe([foo, "bar"], callback1);
        bus.subscribe("bar", callback2);

        bus.emit(foo, payloads[foo]);
        bus.emit("bar", payloads.bar);
        unsub();
        bus.emit("bar", payloads.bar);
        expect(callback1).toHaveBeenCalledTimes(2);
        expect(callback2).toHaveBeenCalledTimes(2);
      });
    });

    describe("using unsubscribe function", () => {
      it("should return true if able to unsubscribe", () => {
        bus.subscribe("bar", callback1);
        expect(bus.unsubscribe("bar", callback1)).toEqual([true]);
      });

      it("should return false if it cannot find the callback to unsubscribe", () => {
        bus.subscribe("bar", callback1);
        expect(bus.unsubscribe("bar", callback2)).toEqual([false]);
      });
      it("should not call the unsubbed consumer", () => {
        bus.subscribe("baz", callback1);
        bus.emit("baz", payloads.baz);
        bus.unsubscribe("baz", callback1);
        bus.emit("baz", payloads.baz);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledWith(payloads.baz);
      });

      it("should call remaining subscribed consumers", () => {
        bus.subscribe("bar", callback1);
        bus.subscribe("bar", callback2);
        bus.subscribe("bar", callback3);

        bus.emit("bar", payloads.bar);
        bus.unsubscribe("bar", callback1);
        bus.emit("bar", payloads.bar);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(2);
        expect(callback3).toHaveBeenCalledTimes(2);
      });
    });

    describe("using unsubscribeAll", () => {
      it("should remove all callbacks from the event", () => {
        bus.subscribe("bar", callback1);
        bus.subscribe("bar", callback2);
        bus.subscribe("bar", callback3);

        bus.emit("bar", payloads.bar);
        bus.unsubscribeAll("bar");
        bus.emit("bar", payloads.bar);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback3).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("unknown events", () => {
    let untypedBus = Luister();

    beforeEach(() => {
      untypedBus = Luister();
    });
    describe("unsubscribing", () => {
      it("should return false if trying to unsub", () => {
        expect(untypedBus.unsubscribe("unknown", callback1)).toEqual([false]);
      });
    });

    describe("emitting", () => {
      it("should do nothing when emitting unknown event", () => {
        expect(() => untypedBus.emit("unknown", undefined)).not.toThrow();
      });
    });
  });
});
