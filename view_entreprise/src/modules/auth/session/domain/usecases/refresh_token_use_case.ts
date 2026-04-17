import { SessionRepository } from "../repositories/session_repository";
import { TokenPair } from "@/modules/auth/types/token_pair_types";

/**
 * Rafraîchissement du token d'accès. Rotation des tokens : l'ancien refresh_token est révoqué et un nouveau émis.
 */
export class RefreshTokenUseCase {
    constructor(private readonly repository: SessionRepository) {}

    /**
     * Executes the use case.
     */
    async execute(refresh_token: string): Promise<TokenPair | null> {
        return this.repository.refreshToken(refresh_token);
    }
}
