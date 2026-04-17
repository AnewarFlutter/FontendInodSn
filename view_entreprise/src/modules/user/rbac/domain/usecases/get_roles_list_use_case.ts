import { RbacRepository } from "../repositories/rbac_repository";

/**
 * Liste les rôles assignables dans le système. Permission: role.list
 */
export class GetRolesListUseCase {
    constructor(private readonly repository: RbacRepository) {}

    /**
     * Executes the use case.
     */
    async execute(): Promise<object[] | null> {
        return this.repository.getRolesList();
    }
}
