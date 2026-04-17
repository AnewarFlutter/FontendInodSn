import { SessionRepository } from "../repositories/session_repository";

/**
 * Déconnexion et révocation des tokens. Option pour révoquer toutes les sessions actives.
 */
export class LogoutUseCase {
    constructor(private readonly repository: SessionRepository) {}

    /**
     * Executes the use case.
     */
    async execute(refresh_token: string, logout_all?: boolean): Promise<string | null> {
        return this.repository.logout(refresh_token, logout_all);
    }
}
