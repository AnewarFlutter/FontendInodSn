import { UserManagementRepository } from "../repositories/user_management_repository";

/**
 * Soft delete d'un utilisateur (restaurable). Permission: user.delete
 */
export class SoftDeleteUserUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string): Promise<string | null> {
        return this.repository.softDeleteUser(user_id);
    }
}
