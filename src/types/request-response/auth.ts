import { JSONSchemaType } from 'ajv';
import { createRequestResponseSchema, RequestResponseBase, RESPONSE_TYPE_NAMES, ajv } from './base';

// ==================================
// ========== LoginStatus ===========
// ==================================

export interface LoginStatus {
  login: string;
  isLogined: boolean;
}

const LoginStatusSchemaContent = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    isLogined: { type: 'boolean' },
  },
  required: ['login', 'isLogined'],
} as const;

const LoginStatusSchema: JSONSchemaType<LoginStatus> = {
  ...LoginStatusSchemaContent,
  additionalProperties: false,
};
const validateLoginStatus = ajv.compile(LoginStatusSchema);

export function isLoginStatus(data: unknown): data is LoginStatus {
  return validateLoginStatus(data);
}

export function isUserListArray(data: unknown): data is Array<LoginStatus> {
  if (Array.isArray(data)) {
    if (data.length === 0) return true;

    return data.every((entry) => isLoginStatus(entry));
  }

  return false;
}

// ==================================
// ========== LoginData =============
// ==================================

export interface LoginData {
  login: string;
  password: string;
}

const LoginDataSchemaContent = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['login', 'password'],
} as const;

const LoginDataSchema: JSONSchemaType<LoginData> = {
  ...LoginDataSchemaContent,
  additionalProperties: false,
};
const validateLoginData = ajv.compile(LoginDataSchema);

export function isLoginData(data: unknown): data is LoginData {
  return validateLoginData(data);
}

// ==================================
// ========== LoginRequest ==========
// ==================================

export type LoginRequest = RequestResponseBase<
  typeof RESPONSE_TYPE_NAMES.login,
  { user: LoginData }
>;

const LoginRequestSchema: JSONSchemaType<LoginRequest> = createRequestResponseSchema<LoginRequest>(
  RESPONSE_TYPE_NAMES.login,
  { user: LoginDataSchemaContent }
);
const validateLoginRequest = ajv.compile(LoginRequestSchema);

export function isLoginRequest(data: unknown): data is LoginRequest {
  return validateLoginRequest(data);
}

// ==================================
// ========== LoginResponse =========
// ==================================

export type LoginResponse = RequestResponseBase<
  typeof RESPONSE_TYPE_NAMES.login,
  { user: LoginStatus }
>;

const LoginResponseSchema: JSONSchemaType<LoginResponse> =
  createRequestResponseSchema<LoginResponse>(RESPONSE_TYPE_NAMES.login, {
    user: LoginStatusSchemaContent,
  });

const validateLoginResponse = ajv.compile(LoginResponseSchema);

export function isLoginResponse(data: unknown): data is LoginResponse {
  return validateLoginResponse(data);
}

// ==================================
// ========== LogoutRequest =========
// ==================================

export type LogoutRequest = RequestResponseBase<
  typeof RESPONSE_TYPE_NAMES.logout,
  { user: LoginData }
>;

const LogoutRequestSchema: JSONSchemaType<LogoutRequest> =
  createRequestResponseSchema<LogoutRequest>(RESPONSE_TYPE_NAMES.logout, {
    user: LoginDataSchemaContent,
  });
const validateLogoutRequest = ajv.compile(LogoutRequestSchema);

export function isLogoutRequest(data: unknown): data is LogoutRequest {
  return validateLogoutRequest(data);
}

// ==================================
// ========== LogoutResonse =========
// ==================================

export type LogoutResponse = RequestResponseBase<
  typeof RESPONSE_TYPE_NAMES.logout,
  { user: LoginStatus }
>;

const LogoutResponseSchema: JSONSchemaType<LogoutResponse> =
  createRequestResponseSchema<LogoutResponse>(RESPONSE_TYPE_NAMES.logout, {
    user: LoginStatusSchemaContent,
  });
const validateLogoutResponse = ajv.compile(LogoutResponseSchema);

export function isLogoutResponse(data: unknown): data is LogoutResponse {
  return validateLogoutResponse(data);
}

// ==================================
// ====== ExternalLoginResponse =====
// ==================================

export type ExternalLoginResponse = RequestResponseBase<
  typeof RESPONSE_TYPE_NAMES.externalLogin,
  { user: LoginStatus }
>;

const ExternalLoginResponseSchema: JSONSchemaType<ExternalLoginResponse> =
  createRequestResponseSchema<ExternalLoginResponse>(RESPONSE_TYPE_NAMES.externalLogin, {
    user: LoginStatusSchemaContent,
  });

const validateExternalLoginResponse = ajv.compile(ExternalLoginResponseSchema);

export function isExternalLoginResponse(data: unknown): data is ExternalLoginResponse {
  return validateExternalLoginResponse(data);
}
// ==================================
// ===== ExternalLogoutResponse =====
// ==================================

export type ExternalLogoutResponse = RequestResponseBase<
  typeof RESPONSE_TYPE_NAMES.externalLogout,
  { user: LoginStatus }
>;

const ExternalLogoutResponseSchema: JSONSchemaType<ExternalLogoutResponse> =
  createRequestResponseSchema<ExternalLogoutResponse>(RESPONSE_TYPE_NAMES.externalLogout, {
    user: LoginStatusSchemaContent,
  });

const validateExternalLogoutResponse = ajv.compile(ExternalLogoutResponseSchema);

export function isExternalLogoutResponse(data: unknown): data is ExternalLogoutResponse {
  return validateExternalLogoutResponse(data);
}

// ==================================
// ===== getActiveUsersResponse =====
// ==================================

export type GetActiveUsersResponse = RequestResponseBase<
  typeof RESPONSE_TYPE_NAMES.getActiveUsers,
  { users: Array<LoginStatus> }
>;

const GetActiveUsersResponseSchema: JSONSchemaType<GetActiveUsersResponse> =
  createRequestResponseSchema<GetActiveUsersResponse>(RESPONSE_TYPE_NAMES.getActiveUsers, {
    users: { type: 'array', items: LoginStatusSchemaContent },
  });

const validateGetActiveUsersResponse = ajv.compile(GetActiveUsersResponseSchema);

export function isGetActiveUsersResponse(data: unknown): data is GetActiveUsersResponse {
  return validateGetActiveUsersResponse(data);
}

// ==================================
// ==== getInactiveUsersResponse ====
// ==================================

export type GetInactiveUsersResponse = RequestResponseBase<
  typeof RESPONSE_TYPE_NAMES.getInactiveUsers,
  { users: Array<LoginStatus> }
>;

const GetInactiveUsersResponseSchema: JSONSchemaType<GetInactiveUsersResponse> =
  createRequestResponseSchema<GetInactiveUsersResponse>(RESPONSE_TYPE_NAMES.getInactiveUsers, {
    users: { type: 'array', items: LoginStatusSchemaContent },
  });

const validateGetInactiveUsersResponse = ajv.compile(GetInactiveUsersResponseSchema);

export function isGetInactiveUsersResponse(data: unknown): data is GetInactiveUsersResponse {
  return validateGetInactiveUsersResponse(data);
}
