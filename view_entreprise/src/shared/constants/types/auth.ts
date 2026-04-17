export interface AUTH_LOGIN_PARAMS {
  body: {
    identifier_type: string;
    identifier: string;
    password: string;
    context: string;
  };


}
export interface AUTH_LOGIN_RESPONSE_200 {
  status: string;
  message: string;
  token: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
  user: {
    data: {
      id: string;
      auth_user_id: string;
      email: string;
      firstname: string;
      lastname: string;
      pseudo: string;
      photo?: string;
      gender?: string;
      birth_date?: string;
      telephone?: string;
      created_at: string;
      current_role: {
        code: string;
        name: string;
        level: number;
        context: string;
        permissions: {
          base: string[];
          custom: {
            added: string[];
            removed: string[];
          };
        };
      };
      available_roles: { [key: string]: unknown }[];
    };
    email_verified: boolean;
    is_active: boolean;
  };
}
export interface AUTH_LOGIN_RESPONSE_400 {
  identifier_type?: string[];
  identifier?: string[];
  password?: string[];
  context?: string[];
  non_field_errors?: string[];
  status?: string;
  message?: string;
  code?: string;
}
export interface AUTH_LOGIN_RESPONSE_401 {
  status: string;
  error: string;
  remaining_attempts: number;
}
export interface AUTH_LOGIN_RESPONSE_403 {
  status: string;
  message: string;
  code: string;
}
export interface AUTH_LOGOUT_PARAMS {
  body: {
    refresh_token: string;
    logout_all?: boolean;
  };


}
export interface AUTH_LOGOUT_RESPONSE_200 {
  status: string;
  message: string;
  sessions_revoked?: number;
}
export interface AUTH_LOGOUT_RESPONSE_400 {
  status: string;
  message: string;
  code: string;
}
export interface AUTH_LOGOUT_RESPONSE_401 {
  status: string;
  message: string;
  code: string;
}
export interface AUTH_REFRESH_TOKEN_PARAMS {
  body: {
    refresh_token: string;
  };


}
export interface AUTH_REFRESH_TOKEN_RESPONSE_200 {
  status: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}
export interface AUTH_REFRESH_TOKEN_RESPONSE_400 {
  status: string;
  message: string;
  code: string;
}
export interface AUTH_SWITCH_CONTEXT_PARAMS {
  body: {
    context: string;
  };


}
export interface AUTH_SWITCH_CONTEXT_RESPONSE_200 {
  status: string;
  message: string;
  token: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
  current_context: string;
}
export interface AUTH_SWITCH_CONTEXT_RESPONSE_400 {
  context?: string[];
  non_field_errors?: string[];
  status?: string;
  message?: string;
  code?: string;
}
export interface AUTH_SWITCH_CONTEXT_RESPONSE_401 {
  status: string;
  message: string;
  code: string;
}
export interface AUTH_CHANGE_PASSWORD_PARAMS {
  body: {
    old_password: string;
    new_password: string;
  };
}
export interface AUTH_CHANGE_PASSWORD_RESPONSE_200 {
  message: string;
}
export interface AUTH_CHANGE_PASSWORD_RESPONSE_400 {
  error: string;
  code?: string;
}
export interface AUTH_CHANGE_PASSWORD_RESPONSE_401 {
  detail: string;
}

