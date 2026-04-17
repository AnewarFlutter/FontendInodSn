import "server-only";
import { cookies } from "next/headers";

export type SessionData = {
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresIn?: number | null;
};

export const SessionManager = {

    /** Crée et stocke les tokens dans des cookies httpOnly */
    async create({ accessToken, refreshToken, expiresIn }: { accessToken: string; refreshToken: string; expiresIn?: number }): Promise<void> {
        try {
            const cookieStore = await cookies();
            const isProduction = process.env.NODE_ENV === "production";

            cookieStore.set("access_token", accessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: "lax",
                path: "/",
                ...(expiresIn ? { maxAge: expiresIn } : {}),
            });

            cookieStore.set("refresh_token", refreshToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 30,
            });

            console.log("Session creee avec succes");
        } catch (error) {
            console.error("SessionManager.create() error:", error);
        }
    },

    /** Récupère les tokens depuis les cookies httpOnly */
    async get(): Promise<SessionData | null> {
        try {
            const cookieStore = await cookies();
            const accessToken = cookieStore.get("access_token")?.value ?? null;
            const refreshToken = cookieStore.get("refresh_token")?.value ?? null;
            if (!accessToken && !refreshToken) return null;
            return { accessToken, refreshToken };
        } catch (error) {
            console.error("SessionManager.get() error:", error);
            return null;
        }
    },

    /** Supprime les cookies de session */
    async clear(): Promise<void> {
        try {
            const cookieStore = await cookies();
            cookieStore.delete("access_token");
            cookieStore.delete("refresh_token");
            cookieStore.delete("user_session");
            console.log("Session supprimee");
        } catch (error) {
            console.error("SessionManager.clear() error:", error);
        }
    },
};
