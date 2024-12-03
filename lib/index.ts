import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { isV1Event, isV2Event } from './utilities/validation';

type Fetch = (request: Request) => Promise<Response>;
type Handler = <T extends APIGatewayProxyEvent | APIGatewayProxyEventV2>(
  event: T,
) => Promise<APIGatewayProxyResult | APIGatewayProxyStructuredResultV2>;

function buildV1Request(event: APIGatewayProxyEvent, baseUrl: string, headers: Record<string, string>) {
  const queryString = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...event.queryStringParameters })) {
    if (value === undefined) continue;
    queryString.set(key, value);
  }

  const rawQueryString = queryString.toString();
  const url = new URL(event.path + (rawQueryString ? '?' + rawQueryString : ''), baseUrl);

  return new Request(url, {
    body: event.body,
    headers,
    method: event.httpMethod,
  });
}

function buildV2Request(event: APIGatewayProxyEventV2, baseUrl: string, headers: Record<string, string>) {
  return new Request(new URL(event.rawPath + (event.rawQueryString ? '?' + event.rawQueryString : ''), baseUrl), {
    body: event.body,
    headers,
    method: event.requestContext.http.method,
  });
}

export function createLambdaHandler(fetch: Fetch): Handler {
  return async (event) => {
    let request: Request;
    const hostname = event.requestContext.domainName ?? 'unknown';
    const baseUrl =
      hostname.startsWith('http://') || hostname.startsWith('https://') ? hostname : 'https://' + hostname;

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(event.headers)) {
      if (typeof value === 'undefined') continue;
      headers[key] = value;
    }

    if (isV2Event(event)) {
      request = buildV2Request(event, baseUrl, headers);
    } else if (isV1Event(event)) {
      request = buildV1Request(event, baseUrl, headers);
    } else {
      throw new Error('Invalid AWS event type.');
    }

    const result = await fetch(request);

    console.log(result.headers);

    return {
      body: await result.text(),
      statusCode: result.status,
      headers: result.headers.toJSON(),
      isBase64Encoded: false,
    } as APIGatewayProxyStructuredResultV2 | APIGatewayProxyResult;
  };
}