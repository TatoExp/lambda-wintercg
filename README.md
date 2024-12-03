# lambda-wintercg

A minimal wrapper to create a lambda handler around a wintercg compatible fetch handler.

Designed for ElysiaJS, mileage may vary.

## Minimal Example

```ts
import { createLambdaHandler } from 'lambda-wintercg';
import { Elysia } from 'elysia';

const api = new Elysia();

const handler = createLambdaHandler(api.handle);

export { handler };
```
