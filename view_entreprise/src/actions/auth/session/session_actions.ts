"use server";

/**
 * Fichier action prévu pour le module auth et la feature session.
 * Actions utilisées par les composants React pour interagir avec les UseCases via les controllers.
 * N'appelez pas de UseCases directement ici, mais via les controllers.
 * N'appelez jamais les controllers depuis les composants React, seulement depuis les fichiers actions.
 */

import { featuresDi } from "@/di/features_di";
import { SessionCookies } from "@/lib/session_cookies";
import { SessionManager } from "@/lib/session_manager";
import { LoginPayload } from "@/modules/auth/session/domain/types/login_payload";
import { SwitchContextPayload } from "@/modules/auth/session/domain/types/switch_context_payload";
import { LoginResponseData } from "@/modules/auth/types/login_response_data_types";
import { TokenPair } from "@/modules/auth/types/token_pair_types";
import { AppActionResult } from "@/shared/types/global";

// ─── Actions ───────────────────────────────────────────────────────────────

/**
 * Authentifie un utilisateur et stocke les tokens dans des cookies httpOnly sécurisés.
 * @param payload Les données de connexion (identifier_type, identifier, password, context).
 */
export async function loginAction(payload: LoginPayload): Promise<AppActionResult<LoginResponseData>> {

    console.log("Debut de connexion >", payload);

    if (!payload.identifier || !payload.password) {
        return {
            success: false,
            message: "Votre identifiant ou mot de passe est manquant.",
            data: undefined,
        };
    }

    const session: LoginResponseData | null = await featuresDi.sessionController.login(payload);

    if (!session) {
        return {
            success: false,
            message: "Identifiants incorrects ou compte inactif.",
            data: undefined,
        };
    }

    console.warn("Session >", session);

    await SessionManager.create({
        accessToken: session.token.access_token,
        refreshToken: session.token.refresh_token,
       // expiresIn: session.token.expires_in,
    });

    await SessionCookies.set(session.user);

    return {
        success: true,
        message: "Connexion reussie.",
        data: session,
    };
}

/**
 * Déconnecte l'utilisateur, révoque le refresh_token et supprime tous les cookies de session.
 * @param logoutAll Si true, révoque toutes les sessions actives de l'utilisateur.
 */
export async function logoutAction(logoutAll?: boolean): Promise<AppActionResult<string>> {

    console.log("Token:", await SessionManager.get());

    const sessionData = await SessionManager.get();
    const refreshToken = sessionData?.refreshToken;

    if (!refreshToken) {
        await SessionManager.clear();
        await SessionCookies.clear(true);
        return {
            success: true,
            message: "Session deja terminee.",
        };
    }

    const result = await featuresDi.sessionController.logout(refreshToken, logoutAll);

    await SessionManager.clear();
    await SessionCookies.clear(true);

    if (result === null) {
        return { success: false, message: "Erreur lors de la deconnexion." };
    }

    return { success: true, message: result };
}

/**
 * Rafraîchit le token d'accès à partir du refresh_token stocké dans les cookies.
 * En cas d'échec, la session est nettoyée.
 */
export async function refreshTokenAction(): Promise<AppActionResult<TokenPair>> {

    const refreshToken = (await SessionManager.get())?.refreshToken;

    if (!refreshToken) {
        return { success: false, message: "Aucun token de rafraichissement trouve." };
    }

    const result = await featuresDi.sessionController.refreshToken(refreshToken);

    if (result === null) {
        await SessionManager.clear();
        await SessionCookies.clear(true);
        return { success: false, message: "Token expire ou invalide. Veuillez vous reconnecter." };
    }

    await SessionManager.create({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        expiresIn: result.expires_in,
    });

    return { success: true, message: "Token rafraichi avec succes.", data: result };
}

/**
 * Change le contexte (rôle) de l'utilisateur connecté et met à jour les tokens.
 * @param payload Le nouveau contexte souhaité.
 */
export async function switchContextAction(payload: SwitchContextPayload): Promise<AppActionResult<LoginResponseData>> {

    const result = await featuresDi.sessionController.switchContext(payload);

    if (result === null) {
        return { success: false, message: "Impossible de changer de contexte." };
    }

    await SessionManager.create({
        accessToken: result.token.access_token,
        refreshToken: result.token.refresh_token,
        //expiresIn: result.token.expires_in,
    });

    await SessionCookies.set(result.user);

    return { success: true, message: "Contexte change avec succes.", data: result };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Enregistre manuellement les cookies de session.
 * @param userData Les données utilisateur à stocker.
 */
export const setSessionCookiesAction = async (userData: object): Promise<void> => {
    await SessionCookies.set(userData);
};

/**
 * Récupère les données utilisateur depuis le cookie de session.
 * @returns L'objet user ou null.
 */
export const getSessionFromCookieAction = async (): Promise<object | null> => {
    return await SessionCookies.get();
};

/**
 * Supprime les cookies de session.
 * @param keepEmail Si true, conserve le cookie user_session.
 */
export const clearSessionCookiesAction = async (keepEmail: boolean = false): Promise<void> => {
    await SessionCookies.clear(keepEmail);
};

/**
 * Récupère les tokens de session (pour usage dans les hooks).
 */
export async function getHookSession() {
    return await SessionManager.get();
}
