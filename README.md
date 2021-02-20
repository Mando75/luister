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

The library emits two functions, `emit` and `subscribe`.

Use `subscribe` to listen to a particular event, and process a payload when it is emitted.

Use `emit` to trigger an event and call any subscribers with a given payload.

### Example

```typescript
import { emit, subscribe } from "@mando75/luister";

// You can use either symbols or string keys to 
// subscribe to events
const logEvent = Symbol("logEvent");

interface LogPayload {
  a: string;
  b: number;
}

subscribe(logEvent, (payload: LogPayload) => {
  logger(payload);
});

emit(logEvent, { a: "My Message", b: 123 });
```

## Features

- [x] Each event can trigger multiple subscribers.

## Roadmap

- [ ] Unsubscribe from events

- [ ] Subscribe to multiple events

- [ ] Subscribe to wildcard events

- [ ] Asynchronous events (via Promises)

## Contributing

Contributions are not open at this time. Feel free to open an issue for any bugs you find in the code, but any non-maintainer created pull requests will be closed. 

## Code of Conduct

Treat others how you would like to be treated.

Trolling, harassment, or discrimination will not be tolerated. 
