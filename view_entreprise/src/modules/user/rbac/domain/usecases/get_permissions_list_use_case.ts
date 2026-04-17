import { RbacRepository } from "../repositories/rbac_repository";

/**
 * Liste toutes les permissions disponibles dans le système. Permission: permission.list
 */
export class GetPermissionsListUseCase {
    constructor(private readonly repository: RbacRepository) {}

    /**
     * Executes the use case.
     */
    async execute(): Promise<object[] | null> {
        return this.repository.getPermissionsList();
    }
}
