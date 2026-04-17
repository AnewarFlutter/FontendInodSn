import { UserManagementRepository } from "../repositories/user_management_repository";
import { UserRoleCodeEnum } from "@/modules/user/enums/user_role_code_enum";

/**
 * Révoque des rôles d'un utilisateur. Permission: role.revoke
 */
export class RevokeUserRolesUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, roles: UserRoleCodeEnum[]): Promise<string | null> {
        return this.repository.revokeUserRoles(user_id, roles);
    }
}
