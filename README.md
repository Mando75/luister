# Luister

[![coverage report](https://gitlab.com/Mando75/luister/badges/master/coverage.svg)](https://gitlab.com/Mando75/luister/-/commits/master)
[![pipeline status](https://gitlab.com/Mando75/luister/badges/master/pipeline.svg)](https://gitlab.com/Mando75/luister/-/commits/master)

A functional event emitter library written in Typescript

## Installation

**Coming Soon**

```shell
yarn install @mando75/luister
# OR
npm install @mando75/luister
```

## Usage

The library provides a global event bus that you can use by using the named exports `emit`, `subscribe`,
and `unsubscribe`.

Alternatively, you can create an isolated event bus by invoking the named export `Luister`. The return value of this
function includes the same `emit`, `subscribe`, and `unsubscribe` methods as the global bus.

Use `emit` to trigger an event and call any subscribers with a given payload.

Use `subscribe` to listen to a particular event, and process a payload when it is emitted. Also returns a function that
you can invoke to unsubscribe the consumer from the event

Use `unsubscribe` to remove a consumer from a given event.

### Example

#### Global Bus

```typescript
import { emit, subscribe, unsubscribe } from "@mando75/luister";

// You can use either symbols or string keys to
// subscribe to events
const event = Symbol("event");

// Define a consumer externally
const loggingConsumer = (payload: string) => console.log(payload);

subscribe(event, loggingConsumer);

// Or provide one inline
const unsubscribeAlert = subscribe(event, (payload: string) => alert(payload));

// Will invoke both the logging and alert consumers
emit(event, "Hello World!");

// Unsubscribe by either speciying the event and consumer
unsubscribe(event, loggingConsumer);

// or using the helper function returned from `subscribe`.
// This is useful if you would like to use an inline consumer
unsubscribeAlert();
```

#### Create an isolated bus

```typescript
import { Luister } from "@mando75/luister";

// Use default export to create your own bus.
const myEventBus = Luister();

myEventBus.subscribe("print-message", (payload: string) =>
  console.log(payload)
);

myEventBus.emit("print-message", "Hello World!");
```

## Features

- [x] Each event can trigger multiple subscribers.

- [x] Unsubscribe from events

## Roadmap

- [ ] Subscribe to multiple events with the same consumer

- [ ] Subscribe to all events

- [ ] Asynchronous events (via Promises)

## Contributing

Contributions are not open at this time. Feel free to open an issue for any bugs you find in the code, but any
non-maintainer created pull requests will be closed.

## Code of Conduct

Treat others how you would like to be treated.

Trolling, harassment, or discrimination will not be tolerated.
