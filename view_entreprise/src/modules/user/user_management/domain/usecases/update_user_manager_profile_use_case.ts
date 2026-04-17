import { UserManagementRepository } from "../repositories/user_management_repository";
import { UpdateUserManagerProfilePayload } from "@/modules/user/user_management/domain/types/update_user_manager_profile_payload";

/**
 * Modifie le profil manager d'un utilisateur (ADMIN uniquement). Permission: user.update
 */
export class UpdateUserManagerProfileUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, payload: UpdateUserManagerProfilePayload): Promise<string | null> {
        return this.repository.updateUserManagerProfile(user_id, payload);
    }
}
