import { describe, expect, it } from 'bun:test';
import { Elysia, t } from 'elysia';
import { createLambdaHandler } from '../lib';
import { createApiGatewayV2Event } from './utility/createApiGatewayV2Event';
import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

describe('ApiGatewayV2', () => {
  it("Should return a 404 for a route that doesn't exist", async () => {
    const api = new Elysia();

    const handler = createLambdaHandler(api.handle);

    const response = await handler(createApiGatewayV2Event({
      method: 'GET',
      path: '/hello-world',
    })) as APIGatewayProxyStructuredResultV2;

    expect(response.body).toEqual("NOT_FOUND");
    expect(response.statusCode).toEqual(404);
  });

  it("Should successfully validate and return a response for a route that exists", async () => {
    const api = new Elysia();
    api.post("/greet", (req) => {
      const response = Response.json({ subject: 'world' });
      response.headers.set("my-header", "my-value");

      return response;
    }, {
      body: t.Object({
        greeting: t.Const("hello")
      }),
      query: t.Object({
        myParam: t.Const("myValue")
      }),
      headers: t.Object({
        "sent-header": t.Const("sent-value")
      })
    });

    const handler = createLambdaHandler(api.handle);

    const response = await handler(createApiGatewayV2Event({
      method: 'POST',
      path: '/greet',
      body: JSON.stringify({
        greeting: 'hello'
      }),
      headers: {
        "sent-header": "sent-value",
        "content-type": "application/json"
      },
      query: {
        myParam: "myValue"
      }
    })) as APIGatewayProxyStructuredResultV2;

    expect(response.body).toEqual(JSON.stringify({ subject: 'world' }))
    expect(response.statusCode).toEqual(200);
    expect(response.headers).toHaveProperty("my-header")
    expect(response.headers!["my-header"]).toEqual("my-value");
  })
});
