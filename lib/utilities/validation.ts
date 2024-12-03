import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';

export function isV1Event(event: any): event is APIGatewayProxyEvent {
  return event.version === '1.0';
}

export function isV2Event(event: any): event is APIGatewayProxyEventV2 {
  return event.version === '2.0';
}
