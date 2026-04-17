import { APP_CONFIG } from "../app_config";
import { AUTH_LOGIN_PARAMS, AUTH_LOGIN_RESPONSE_200, AUTH_LOGIN_RESPONSE_400, AUTH_LOGIN_RESPONSE_401, AUTH_LOGIN_RESPONSE_403, AUTH_LOGOUT_PARAMS, AUTH_LOGOUT_RESPONSE_200, AUTH_LOGOUT_RESPONSE_400, AUTH_LOGOUT_RESPONSE_401, AUTH_REFRESH_TOKEN_PARAMS, AUTH_REFRESH_TOKEN_RESPONSE_200, AUTH_REFRESH_TOKEN_RESPONSE_400, AUTH_SWITCH_CONTEXT_PARAMS, AUTH_SWITCH_CONTEXT_RESPONSE_200, AUTH_SWITCH_CONTEXT_RESPONSE_400, AUTH_SWITCH_CONTEXT_RESPONSE_401, AUTH_CHANGE_PASSWORD_PARAMS, AUTH_CHANGE_PASSWORD_RESPONSE_200, AUTH_CHANGE_PASSWORD_RESPONSE_400, AUTH_CHANGE_PASSWORD_RESPONSE_401 } from "../types/auth";

export const AUTH = {
  LOGIN: {
    path: `${APP_CONFIG.API.baseUrl}/auth/login/`,
    method: "POST" as const,
    auth: false,
    params: {} as AUTH_LOGIN_PARAMS,
    response: {} as AUTH_LOGIN_RESPONSE_200,
    responses: { 400: {} as AUTH_LOGIN_RESPONSE_400, 401: {} as AUTH_LOGIN_RESPONSE_401, 403: {} as AUTH_LOGIN_RESPONSE_403 },
  },
  LOGOUT: {
    path: `${APP_CONFIG.API.baseUrl}/auth/logout/`,
    method: "POST" as const,
    auth: true,
    params: {} as AUTH_LOGOUT_PARAMS,
    response: {} as AUTH_LOGOUT_RESPONSE_200,
    responses: { 400: {} as AUTH_LOGOUT_RESPONSE_400, 401: {} as AUTH_LOGOUT_RESPONSE_401 },
  },
  REFRESH_TOKEN: {
    path: `${APP_CONFIG.API.baseUrl}/auth/refresh/`,
    method: "POST" as const,
    auth: false,
    params: {} as AUTH_REFRESH_TOKEN_PARAMS,
    response: {} as AUTH_REFRESH_TOKEN_RESPONSE_200,
    responses: { 400: {} as AUTH_REFRESH_TOKEN_RESPONSE_400 },
  },
  SWITCH_CONTEXT: {
    path: `${APP_CONFIG.API.baseUrl}/auth/switch-context/`,
    method: "POST" as const,
    auth: true,
    params: {} as AUTH_SWITCH_CONTEXT_PARAMS,
    response: {} as AUTH_SWITCH_CONTEXT_RESPONSE_200,
    responses: { 400: {} as AUTH_SWITCH_CONTEXT_RESPONSE_400, 401: {} as AUTH_SWITCH_CONTEXT_RESPONSE_401 },
  },
  CHANGE_PASSWORD: {
    path: `${APP_CONFIG.API.baseUrl}/auth/change-password/`,
    method: "POST" as const,
    auth: true,
    params: {} as AUTH_CHANGE_PASSWORD_PARAMS,
    response: {} as AUTH_CHANGE_PASSWORD_RESPONSE_200,
    responses: { 400: {} as AUTH_CHANGE_PASSWORD_RESPONSE_400, 401: {} as AUTH_CHANGE_PASSWORD_RESPONSE_401 },
  },
};
