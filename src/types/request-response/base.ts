import Ajv, { JSONSchemaType } from 'ajv';
export const ajv = new Ajv();

export const RESPONSE_TYPE_NAMES = {
  login: 'USER_LOGIN',
  logout: 'USER_LOGOUT',
  error: 'ERROR',
  msgSend: 'MSG_SEND',
  externalLogin: 'USER_EXTERNAL_LOGIN',
  externalLogout: 'USER_EXTERNAL_LOGOUT',
  getActiveUsers: 'USER_ACTIVE',
  getInactiveUsers: 'USER_INACTIVE',
} as const;

export type ResponseTypeName = (typeof RESPONSE_TYPE_NAMES)[keyof typeof RESPONSE_TYPE_NAMES];

export interface RequestResponseBase<T extends ResponseTypeName, P> {
  id: string | null;
  type: T;
  payload: P;
}

export function createRequestResponseSchema<T>(
  reqestResponseType: ResponseTypeName,
  payloadObject: object
): JSONSchemaType<T> {
  return {
    type: 'object',
    properties: {
      id: { type: 'string', nullable: true },
      type: { type: 'string', const: reqestResponseType },
      payload: {
        type: 'object',
        properties: payloadObject,
        required: Object.keys(payloadObject),
        nullable: true,
      },
    },
    required: ['id', 'type', 'payload'],
    additionalProperties: false,
  } as JSONSchemaType<T>;
}
