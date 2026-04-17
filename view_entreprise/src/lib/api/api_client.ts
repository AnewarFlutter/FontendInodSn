import { ApiHttpClient, ApiOptions } from "./api_http_client";
import { FetchHttpClient } from "./fetch_http_client";

/**
 *  API Client générique
 *  Generic API client
 */
let defaultHttpClient: ApiHttpClient = new FetchHttpClient();

export function setDefaultHttpClient(client: ApiHttpClient) {
    defaultHttpClient = client;
}

interface ApiClientOptions<TBody> extends ApiOptions<TBody> {
    client?: ApiHttpClient; // permet de forcer un moteur localement
    query?: Record<string, string>;
}

export async function apiClient<TResponse, TBody = unknown>(
    endpoint: string,
    options: ApiClientOptions<TBody> = {},
    auth?: boolean,
) {
    const { client, ...rest } = options;
    const httpClient = client || defaultHttpClient;
    return httpClient.request<TResponse, TBody>(endpoint, rest, auth);
}