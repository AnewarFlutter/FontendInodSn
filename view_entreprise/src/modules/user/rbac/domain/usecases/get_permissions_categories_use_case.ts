import { RbacRepository } from "../repositories/rbac_repository";

/**
 * Liste les catégories de permissions pour affichage groupé dans le frontend. Permission: permission.list
 */
export class GetPermissionsCategoriesUseCase {
    constructor(private readonly repository: RbacRepository) {}

    /**
     * Executes the use case.
     */
    async execute(): Promise<object[] | null> {
        return this.repository.getPermissionsCategories();
    }
}
