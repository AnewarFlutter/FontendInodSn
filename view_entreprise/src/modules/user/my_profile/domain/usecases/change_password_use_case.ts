import { MyProfileRepository } from "../repositories/my_profile_repository";

/**
 * Changer le mot de passe de l'utilisateur connecté via l'endpoint /auth/change-password/.
 */
export class ChangePasswordUseCase {
    constructor(private readonly repository: MyProfileRepository) {}

    /**
     * Executes the use case.
     */
    async execute(old_password: string, new_password: string): Promise<string | null> {
        return this.repository.changePassword(old_password, new_password);
    }
}
