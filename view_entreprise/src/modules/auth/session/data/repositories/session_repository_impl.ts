import { LoginPayload } from "@/modules/auth/session/domain/types/login_payload";
import { SwitchContextPayload } from "@/modules/auth/session/domain/types/switch_context_payload";
import { LoginResponseData } from "@/modules/auth/types/login_response_data_types";
import { TokenPair } from "@/modules/auth/types/token_pair_types";
import { SessionRepository } from "../../domain/repositories/session_repository";
import { SessionDataSource } from "../datasources/session_data_source";

/**
 * Implémentation concrète du repository pour session.
 * Délègue l'accès aux données à un datasource et mappe entre Model et Entity.
 */
export class SessionRepositoryImpl implements SessionRepository {
    constructor(private ds: SessionDataSource) { }


    /**
     * Authentification d'un utilisateur avec email ou téléphone et contexte de rôle
     */
    async login(payload: LoginPayload): Promise<LoginResponseData | null> {

        try {
            const data = await this.ds.login(payload);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Déconnexion et révocation des tokens. Option pour révoquer toutes les sessions actives.
     */
    async logout(refresh_token: string, logout_all?: boolean, access_token?: string): Promise<string | null> {

        try {
            const data = await this.ds.logout(refresh_token, logout_all, access_token);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Rafraîchissement du token d'accès. Rotation des tokens : l'ancien refresh_token est révoqué et un nouveau émis.
     */
    async refreshToken(refresh_token: string): Promise<TokenPair | null> {

        try {
            const data = await this.ds.refreshToken(refresh_token);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Change le contexte (rôle) de l'utilisateur connecté. Retourne de nouveaux tokens avec le contexte mis à jour.
     */
    async switchContext(payload: SwitchContextPayload, access_token?: string): Promise<LoginResponseData | null> {

        try {
            const data = await this.ds.switchContext(payload, access_token);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }
}
