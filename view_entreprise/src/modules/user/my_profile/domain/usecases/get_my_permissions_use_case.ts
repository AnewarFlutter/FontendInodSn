import { MyProfileRepository } from "../repositories/my_profile_repository";

/**
 * Récupère les permissions effectives de l'administrateur connecté (rôles + permissions individuelles)
 */
export class GetMyPermissionsUseCase {
    constructor(private readonly repository: MyProfileRepository) {}

    /**
     * Executes the use case.
     */
    async execute(): Promise<string[] | null> {
        return this.repository.getMyPermissions();
    }
}
