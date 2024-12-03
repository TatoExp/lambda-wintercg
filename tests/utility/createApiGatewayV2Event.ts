import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import type { HTTPMethod } from 'elysia';

interface Config {
  path: string;
  method: HTTPMethod;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: string;
}

export function createApiGatewayV2Event(config: Config): APIGatewayProxyEventV2 {
  return {
    version: '2.0',
    routeKey: '$default',
    rawPath: config.path,
    rawQueryString: new URLSearchParams(config.query ?? {}).toString(),
    cookies: [],
    headers: config.headers ?? {},
    queryStringParameters: config.query ?? {},
    requestContext: {
      accountId: '123456789012',
      apiId: 'api-id',
      authentication: {
        clientCert: {
          clientCertPem: 'CERT_CONTENT',
          subjectDN: 'www.example.com',
          issuerDN: 'Example issuer',
          serialNumber: 'a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1',
          validity: {
            notBefore: 'May 28 12:30:02 2019 GMT',
            notAfter: 'Aug  5 09:36:04 2021 GMT',
          },
        },
      },
      authorizer: {
        jwt: {
          claims: {
            claim1: 'value1',
            claim2: 'value2',
          },
          scopes: ['scope1', 'scope2'],
        },
      },
      domainName: 'localhost',
      domainPrefix: 'id',
      http: {
        method: config.method,
        path: config.path,
        protocol: 'HTTP/1.1',
        sourceIp: '192.0.2.1',
        userAgent: 'agent',
      },
      requestId: 'id',
      routeKey: '$default',
      stage: '$default',
      time: '12/Mar/2020:19:03:58 +0000',
      timeEpoch: 1583348638390,
    },
    body: config.body,
    pathParameters: {},
    isBase64Encoded: false,
    stageVariables: {
      stageVariable1: 'value1',
      stageVariable2: 'value2',
    },
  } as APIGatewayProxyEventV2;
}
