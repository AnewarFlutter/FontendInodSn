/**
 * Format a route template by replacing path params and adding query params.
 * 
 * @param template Example: "/users/{id}/details"
 * @param params Optional path params: { id: "123" }
 * @param query Optional query params: { page: 1, sort: "desc" }
 */
export function formatApiRoute( 

    template: string,
    params?: Record<string, string | number | undefined> | null | unknown,
    query?: Record<string, string | number | undefined | null | unknown>
    
): string {
    let finalRoute = template;

    // Replace path parameters {id}
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                finalRoute = finalRoute.replace(`{${key}}`, encodeURIComponent(String(value)));
            }
        });
    }

    // Remove any unreplaced {param}
    finalRoute = finalRoute.replace(/\{[^}]+\}/g, "");

    // Add query params if they exist
    if (query) {
        const queryString = Object.entries(query)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join("&");

        if (queryString.length > 0) {
            finalRoute += (finalRoute.includes("?") ? "&" : "?") + queryString;
        }
    }

    return finalRoute;
}
