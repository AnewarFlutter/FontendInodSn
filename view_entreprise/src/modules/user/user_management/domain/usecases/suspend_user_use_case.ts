import { UserManagementRepository } from "../repositories/user_management_repository";

/**
 * Suspend un utilisateur. Permission: user.deactivate
 */
export class SuspendUserUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string): Promise<string | null> {
        return this.repository.suspendUser(user_id);
    }
}
