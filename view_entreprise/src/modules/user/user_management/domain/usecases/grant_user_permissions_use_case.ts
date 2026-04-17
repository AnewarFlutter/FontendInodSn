import { UserManagementRepository } from "../repositories/user_management_repository";

/**
 * Accorde des permissions individuelles à un utilisateur. Permission: permission.grant
 */
export class GrantUserPermissionsUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, permissions: string[]): Promise<string | null> {
        return this.repository.grantUserPermissions(user_id, permissions);
    }
}
