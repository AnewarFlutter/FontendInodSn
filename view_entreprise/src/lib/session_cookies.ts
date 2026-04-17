import "server-only";
import { cookies } from "next/headers";

export const SessionCookies = {

    /**
     * Enregistre les données utilisateur dans un cookie de session.
     * @param userData L'objet user retourné par l'API après login.
     */
    async set(userData: object): Promise<void> {
        try {
            const cookieStore = await cookies();
            const isProduction = process.env.NODE_ENV === "production";

            cookieStore.set("user_session", JSON.stringify(userData), {
                httpOnly: false,
                secure: isProduction,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24,
            });

            console.log("Cookie user_session enregistre.");
        } catch (error) {
            console.error("SessionCookies.set() error:", error);
        }
    },

    /**
     * Récupère les données utilisateur depuis le cookie de session.
     * @returns L'objet user ou null si absent ou invalide.
     */
    async get(): Promise<object | null> {
        try {
            const cookieStore = await cookies();
            const raw = cookieStore.get("user_session")?.value;
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (error) {
            console.error("SessionCookies.get() error:", error);
            return null;
        }
    },

    /**
     * Nettoie les cookies de session.
     * @param keepEmail Si true, conserve le cookie user_session (données user).
     */
    async clear(keepEmail: boolean = false): Promise<void> {
        try {
            const cookieStore = await cookies();
            cookieStore.delete("access_token");
            cookieStore.delete("refresh_token");
            if (!keepEmail) {
                cookieStore.delete("user_session");
            }
            console.log(keepEmail ? "Tokens supprimes (user_session conserve)." : "Tous les cookies supprimes.");
        } catch (error) {
            console.error("SessionCookies.clear() error:", error);
        }
    },
};
