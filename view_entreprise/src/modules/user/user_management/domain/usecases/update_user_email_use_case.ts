import { UserManagementRepository } from "../repositories/user_management_repository";

/**
 * Modifie l'email d'un utilisateur (synchronise avec Auth Service). Permission: user.update
 */
export class UpdateUserEmailUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, new_email: string): Promise<string | null> {
        return this.repository.updateUserEmail(user_id, new_email);
    }
}
