import { UserManagementRepository } from "../repositories/user_management_repository";

/**
 * Révoque des permissions individuelles d'un utilisateur. Permission: permission.revoke
 */
export class RevokeUserPermissionsUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, permissions: string[]): Promise<string | null> {
        return this.repository.revokeUserPermissions(user_id, permissions);
    }
}
