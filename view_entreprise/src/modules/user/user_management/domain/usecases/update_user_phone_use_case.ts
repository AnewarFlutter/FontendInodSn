import { UserManagementRepository } from "../repositories/user_management_repository";

/**
 * Modifie le téléphone d'un utilisateur (synchronise avec Auth Service). Permission: user.update
 */
export class UpdateUserPhoneUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, new_phone: string): Promise<string | null> {
        return this.repository.updateUserPhone(user_id, new_phone);
    }
}
