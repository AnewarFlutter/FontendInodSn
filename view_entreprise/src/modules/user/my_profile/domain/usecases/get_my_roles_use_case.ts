import { MyProfileRepository } from "../repositories/my_profile_repository";

/**
 * Récupère les rôles actifs de l'administrateur connecté
 */
export class GetMyRolesUseCase {
    constructor(private readonly repository: MyProfileRepository) {}

    /**
     * Executes the use case.
     */
    async execute(): Promise<object[] | null> {
        return this.repository.getMyRoles();
    }
}
