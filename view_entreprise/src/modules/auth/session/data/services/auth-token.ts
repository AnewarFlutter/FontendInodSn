import "server-only";
import { cookies } from "next/headers";
import { apiClient } from "@/lib/api/api_client";
import { formatApiRoute } from "@/lib/api/format_api_route";
import { SessionManager, SessionData } from "@/lib/session_manager";
import { API_ROUTES } from "@/shared/constants/api_routes";
import { AUTH_REFRESH_TOKEN_RESPONSE_200 } from "@/shared/constants/api_types";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 300;

let isRefreshing = false;

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptRefresh(): Promise<SessionData | null> {
    const session = await SessionManager.get();
    if (!session?.refreshToken) throw new Error("Aucun refresh token disponible");

    const route = formatApiRoute(API_ROUTES.AUTH.REFRESH_TOKEN.path, undefined, undefined);
    const { data, error } = await apiClient<AUTH_REFRESH_TOKEN_RESPONSE_200>(route, {
        method: "POST",
        body: { refresh_token: session.refreshToken },
    }, false);

    if (error || !data?.access_token) throw new Error(`Echec refresh token: ${error}`);

    const isProduction = process.env.NODE_ENV === "production";
    const cookieStore = await cookies();

    cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
       // maxAge: data.expires_in,
    });

    cookieStore.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });

    return { accessToken: data.access_token, refreshToken: data.refresh_token };
}

/**
 * Rafraîchit le token d'accès avec jusqu'à 3 tentatives.
 * Appelé automatiquement par FetchHttpClient lors d'une réponse 401.
 */
export async function refreshToken(): Promise<SessionData | null> {
    if (isRefreshing) return null;
    isRefreshing = true;

    let lastError: unknown = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`Tentative refresh token ${attempt}/${MAX_RETRIES}...`);
            const session = await attemptRefresh();
            console.log(`Token rafraichi avec succes (tentative ${attempt})`);
            isRefreshing = false;
            return session;
        } catch (error) {
            lastError = error;
            console.warn(`Echec tentative ${attempt}/${MAX_RETRIES}:`, error);
            if (attempt < MAX_RETRIES) {
                await wait(RETRY_DELAY_MS * attempt); // 300ms, 600ms, 900ms
            }
        }
    }

    console.error(`Refresh token echoue apres ${MAX_RETRIES} tentatives:`, lastError);
    isRefreshing = false;
    return null;
}
