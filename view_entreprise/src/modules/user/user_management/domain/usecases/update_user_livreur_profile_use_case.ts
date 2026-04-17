import { UserManagementRepository } from "../repositories/user_management_repository";

/**
 * Modifie le profil livreur d'un utilisateur. Permission: user.update
 */
export class UpdateUserLivreurProfileUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string): Promise<string | null> {
        return this.repository.updateUserLivreurProfile(user_id);
    }
}
