import { ajv, createRequestResponseSchema, RequestResponseBase, RESPONSE_TYPE_NAMES } from './base';

export type ErrorResponse = RequestResponseBase<
  typeof RESPONSE_TYPE_NAMES.error,
  { error: string }
>;

const ErrorResponseSchema = createRequestResponseSchema<ErrorResponse>(RESPONSE_TYPE_NAMES.error, {
  error: { type: 'string' },
});
const validateErrorResponse = ajv.compile(ErrorResponseSchema);

export const isErrorResponse = (data: unknown): data is ErrorResponse => {
  return validateErrorResponse(data);
};
