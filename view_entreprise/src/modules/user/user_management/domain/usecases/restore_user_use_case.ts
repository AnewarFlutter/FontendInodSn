import { UserManagementRepository } from "../repositories/user_management_repository";

/**
 * Restaure un utilisateur soft-deleted. Permission: user.restore
 */
export class RestoreUserUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string): Promise<string | null> {
        return this.repository.restoreUser(user_id);
    }
}
