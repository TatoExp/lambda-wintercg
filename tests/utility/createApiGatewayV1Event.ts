import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { HTTPMethod } from 'elysia';

interface Config {
  path: string;
  method: HTTPMethod;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: string;
}

export function createApiGatewayV1Event(config: Config): APIGatewayProxyEvent {
  return {
    version: '1.0',
    resource: config.path,
    path: config.path,
    httpMethod: config.method,
    headers: config.headers ?? {},
    multiValueHeaders: {},
    queryStringParameters: config.query ?? {},
    multiValueQueryStringParameters: {},
    requestContext: {
      accountId: '123456789012',
      apiId: 'id',
      authorizer: {
        claims: null,
        scopes: null,
      },
      domainName: 'localhost',
      domainPrefix: 'id',
      extendedRequestId: 'request-id',
      httpMethod: 'GET',
      identity: {
        accessKey: null,
        accountId: null,
        caller: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: '192.0.2.1',
        user: null,
        userAgent: 'user-agent',
        userArn: null,
        clientCert: null,
        apiKey: null,
        apiKeyId: null,
      },
      path: config.path,
      protocol: 'HTTP/1.1',
      requestId: 'id=',
      requestTime: '04/Mar/2020:19:15:17 +0000',
      requestTimeEpoch: 1583349317135,
      resourceId: '',
      resourcePath: config.path,
      stage: '$default',
    },
    pathParameters: null,
    stageVariables: null,
    body: config.body ?? null,
    isBase64Encoded: false,
  } as APIGatewayProxyEvent;
}
