import { UserManagementRepository } from "../repositories/user_management_repository";
import { UserRoleCodeEnum } from "@/modules/user/enums/user_role_code_enum";

/**
 * Assigne des rôles à un utilisateur. Permission: role.assign
 */
export class AssignUserRolesUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, roles: UserRoleCodeEnum[]): Promise<string | null> {
        return this.repository.assignUserRoles(user_id, roles);
    }
}
