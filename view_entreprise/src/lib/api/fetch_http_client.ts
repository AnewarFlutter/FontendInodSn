import { APP_CONFIG } from "@/shared/constants/app_config";
import { ApiHttpClient, ApiOptions, ApiResponse, INTERCEPTORS } from "./api_http_client";
import { SessionManager } from "../session_manager";
import { SessionCookies } from "../session_cookies";
import { refreshToken } from "@/modules/auth/session/data/services/auth-token";

/**
 * Performs an HTTP request via fetch with app-wide defaults and interceptors.
 *
 * - Prepends APP_CONFIG.API.baseUrl when the endpoint is relative.
 * - Applies INTERCEPTORS.onRequest/onResponse/onError.
 * - Supports bearer token, custom headers, timeout (AbortController), and retries.
 * - Auto-parses response as json | text | blob via options.responseType.
 * - Never throws; returns ApiResponse<TResponse> and maps timeouts to "Request timed out".
 *
 * @template TResponse Response payload type.
 * @template TBody Request body type.
 * @param endpoint Target path or absolute URL.
 * @param options ApiOptions controlling method, body, headers, token, timeout, retries, and responseType.
 * @returns Promise resolving to ApiResponse with data, error, and status.
 */
export class FetchHttpClient implements ApiHttpClient {

    /**
     * Makes an HTTP request to the specified endpoint.
     *
     * @param endpoint The endpoint to call. If the endpoint does not start with 'http', the base URL will be prepended.
     * @param options The options for the request.
     *
     * @returns A promise that resolves to an object containing the response data, error (if any), and status code.
     */
    async request<TResponse, TBody = unknown>(
        endpoint: string,
        options: ApiOptions<TBody>,
        auth: boolean = true,
    ): Promise<ApiResponse<TResponse>> {

        const { method = "GET", body, headers = {}, token, timeout = APP_CONFIG.API.timeout, retries = 0, responseType = "json" } = options;

        const isFormData = body instanceof FormData || options.isMultipart === true;

        // Intercepteur request
        const finalOptions = await INTERCEPTORS.onRequest({
            method,
            body,
            headers,
            token,
            accessToken: options.accessToken,
            refreshToken: options.refreshToken,
            timeout,
            retries,
            responseType,
        }, auth);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        let attempt = 0;
        while (attempt <= retries) {
            try {

                // check if the endpoint is an absolute url
                const isAbsoluteUrl = /^https?:\/\//i.test(endpoint);

                const requestHeaders: Record<string, string> = {
                    Accept: "application/json",
                    ...finalOptions.headers,
                };

                if (!isFormData) {
                    requestHeaders["Content-Type"] = "application/json";
                }

                if (token) {
                    requestHeaders["Authorization"] = `Bearer ${token}`;
                } if (finalOptions.accessToken) {
                    requestHeaders["Authorization"] = `Bearer ${finalOptions.accessToken}`;
                } if (finalOptions.refreshToken) {
                    requestHeaders["Authorization"] = `Bearer ${finalOptions.refreshToken}`;
                }

                let requestBody: BodyInit | undefined;

                if (body !== undefined) {
                    if (isFormData) {
                        if (body instanceof FormData) {
                            requestBody = body;
                        } else {
                            // On assume que body est un objet dont les valeurs sont File, string, number, boolean ou null/undefined
                            type MultipartBody = Record<string, unknown>;
                            const formData = new FormData();

                            (Object.entries(body as MultipartBody) as [string, unknown][]).forEach(
                                ([key, value]) => {
                                    if (value instanceof File) {
                                        formData.append(key, value);
                                    } else if (Array.isArray(value)) {
                                        value.forEach((item) => {
                                            if (item instanceof File) {
                                                formData.append(key, item);
                                            } else if (item !== undefined && item !== null) {
                                                formData.append(key, String(item));
                                            }
                                        });
                                    } else if (value !== undefined && value !== null) {
                                        formData.append(key, String(value));
                                    }
                                }
                            );

                            // requestHeaders["Content-Type"] = "multipart/form-data; boundary=" + formData.getBoundary();                            

                            requestBody = formData;
                        }
                    } else {
                        requestBody = JSON.stringify(body);
                    }
                }

                const res = await fetch(isAbsoluteUrl ? endpoint : `${APP_CONFIG.API.baseUrl}${endpoint}`, {
                    method: finalOptions.method,
                    headers: requestHeaders,
                    body: requestBody,
                    signal: controller.signal,
                });

                clearTimeout(timer);

                const rawtext = await res.text();

                let parsedData: unknown = null;

                if (responseType === "json") {
                    try {
                        parsedData = JSON.parse(rawtext);
                    } catch (err: unknown) {
                        console.error("❌ Error parsing JSON response:", err);
                    }
                }

                if (responseType === "text") parsedData = await res.text();
                if (responseType === "blob") parsedData = await res.blob();

                const response: ApiResponse<TResponse> = {
                    data: res.ok ? (parsedData as TResponse) : null,
                    error: res.ok ? null : (parsedData as { message: string } | null)?.message || res.statusText,
                    status: res.status,
                };

                if (res.status === 401 && !options._retry) {
                    options._retry = true; // évite boucle infinie

                    const newSession = await refreshToken();

                    if (newSession?.accessToken) {
                        // Relance avec les options originales + nouveau token injecté
                        return this.request(endpoint, {
                            ...options,
                            accessToken: newSession.accessToken,
                            headers: {
                                ...options.headers,
                                Authorization: `Bearer ${newSession.accessToken}`,
                            },
                            _retry: true,
                        });
                    }

                    // Les 3 tentatives ont échoué → session expirée
                    await SessionManager.clear();
                    await SessionCookies.clear(true);
                    return {
                        data: null,
                        error: "Session expired. Please login again.",
                        status: 401,
                    };
                }

                return await INTERCEPTORS.onResponse(response);
            } catch (err: unknown) {

                console.error("❌ Erreur réseau ou serveur:", err);

                if (attempt < retries) {
                    attempt++;
                    continue; // retry
                }

                if (err instanceof Error) {
                    const errorResponse: ApiResponse<TResponse> = {
                        data: null,
                        error: err.name === "AbortError" ? "Request timed out" : err.message,
                        status: 500,
                    };

                    await INTERCEPTORS.onError(errorResponse);
                    return errorResponse;
                } else {
                    const errorResponse: ApiResponse<TResponse> = {
                        data: null,
                        error: "An unknown error occurred",
                        status: 500,
                    };

                    await INTERCEPTORS.onError(errorResponse);
                    return errorResponse;
                }
            }
        }

        return { data: null, error: "Unexpected failure", status: 500 };
    }
}
