import { UserManagementRepository } from "../repositories/user_management_repository";

/**
 * Active un utilisateur suspendu. Permission: user.activate
 */
export class ActivateUserUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string): Promise<string | null> {
        return this.repository.activateUser(user_id);
    }
}
