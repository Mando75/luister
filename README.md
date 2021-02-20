# Luister

A functional event emitter library written in Typescript

## Installation

**Coming Soon**

```shell
yarn install @mando75/luister
# OR
npm install @mando75/luister
```

## Usage

The library emits two functions, emit and subscribe.

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

Each event can have multiple subscribers.

## Roadmap

Unsubscribe from events

Subscribe to multiple events

Subscribe to wildcard events

Asynchronous events (via Promises)


## Code of Conduct

Treat others how you would like to be treated.

Trolling, harassment, or discrimination will not be tolerated. 
