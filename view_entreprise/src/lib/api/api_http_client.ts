import { SessionManager } from "../session_manager";

export type AppHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiOptions<TBody = unknown> {
    method?: AppHttpMethod;
    body?: TBody;
    headers?: Record<string, string>;
    /// facultatif si on veut forcer un token custom
    /// optional if you want to force a custom token
    token?: string;
    accessToken?: string;
    refreshToken?: string;
    timeout?: number;
    retries?: number; // nombre de tentatives en cas d’échec
    responseType?: "json" | "text" | "blob"; // auto parse
    _retry?: boolean; // interne pour refresh token

    // 🔥 nouveau
    isMultipart?: boolean; // override manuel si besoin
}

export interface ApiResponse<T> {
    data: T | null;
    error: unknown | null;
    status: number;
}

/**
 * Intercepteurs globaux
 */
export const INTERCEPTORS = {
    onRequest: async (config: ApiOptions, auth: boolean = true) => {
        const session = await SessionManager.get();
        const headers = { ...config.headers };

        console.warn("INTERCEPTOR - session > ", session);
        console.warn("INTERCEPTOR - config > ", config);
        console.warn("INTERCEPTOR - auth > ", auth);

        if (session) {
            // Si aucun token forcé manuellement dans config, on met ceux de la session
            if (!config.accessToken && session.accessToken) {
                headers["Authorization"] = `Bearer ${session.accessToken}`;
            }

            if (!config.refreshToken && session.refreshToken) {
                headers["X-Refresh-Token"] = session.refreshToken;
            }
        }

        console.warn("INTERCEPTOR - headers > ", headers);

        return { ...config, headers };
    },
    onResponse: async <T>(response: ApiResponse<T>) => response,
    onError: async (error: unknown) => error,
};

export interface ApiHttpClient {
    request<TResponse, TBody = unknown>(
        endpoint: string,
        options: ApiOptions<TBody>,
        auth?: boolean
    ): Promise<ApiResponse<TResponse>>;
}