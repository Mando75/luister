# Luister

[![npm version](https://badge.fury.io/js/@mando75%2Fluister.svg)](https://badge.fury.io/js/@mando75%2Fluister)
[![coverage report](https://gitlab.com/Mando75/luister/badges/master/coverage.svg)](https://gitlab.com/Mando75/luister/-/commits/master)
[![pipeline status](https://gitlab.com/Mando75/luister/badges/master/pipeline.svg)](https://gitlab.com/Mando75/luister/-/commits/master)

A simple event emitter library written in Typescript

## Installation

```shell
yarn add @mando75/luister
# OR
npm install @mando75/luister
```

## Source Code

* [GitLab Repository](https://gitlab.com/Mando75/luister)
* [GitHub Repository (Mirror)](https://github.com/Mando75/luister)

## Usage

Checkout the [documentation](https://luister.bmuller.net) for a full API reference.

You can create an event bus by invoking the named export `Luister`. The return value of this function is an object
with `emit`, `subscribe`, and `unsubscribe` methods as properties.

Use `subscribe` to listen to a particular event. It will be called and receive a payload when the event is emitted. It
also returns a function that you can invoke to unsubscribe the consumer from the event for easy cleanup.

Use `emit` to trigger an event and call any subscribers with a given payload.

Use `unsubscribe` to remove a consumer from a given event.

```typescript
import {Luister} from "@mando75/luister";


// Define an interface mapping your event keys to their payload types
// You can use either symbols or strings as event keys
// It is highly recommended to provide an event mapping so that your
// consumers and emits remain typesafe
const fooEvent = Symbol('fooEvent')

interface MyEvents {
  [fooEvent]: { message: string }
  barEvent: string
}

// Create a new bus
const luister = Luister<MyEvents>()

// To subscribe to an event, provide the event key
// and a consumer to process the event data
const unsubFromFoo = luister.subscribe(fooEvent, (payload) => {
  console.log(payload.message)
})

const barConsumer = (message: string) => console.log(message)
luister.subscribe('barEvent', barConsumer)

// Emit a new event. These emits will result in both the consumers defined above
// to log their messages to the console
luister.emit(fooEvent, {message: 'Hello foo!'})
luister.emit('barEvent', 'Hello bar!')

// We can unsubcribe from an event by using the helper returned by subscribe
// Or we can pass the event key and consumer to the unsubscribe method
unsubFromFoo()
luister.unsubscribe('barEvent', barConsumer)
```

## Features

- [x] Each event can trigger multiple subscribers.

- [x] Unsubscribe from events

## Roadmap

- [ ] Subscribe to multiple events with the same consumer

- [ ] Subscribe to all events

## Contributing

Contributions are not open at this time. Feel free to open an issue for any bugs you find in the code, but any
non-maintainer created pull requests will be closed.

## Code of Conduct

Treat others how you would like to be treated.

Trolling, harassment, or discrimination will not be tolerated.
