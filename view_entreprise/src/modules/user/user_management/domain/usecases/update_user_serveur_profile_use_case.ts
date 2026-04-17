import { UserManagementRepository } from "../repositories/user_management_repository";
import { UpdateUserServeurProfilePayload } from "@/modules/user/user_management/domain/types/update_user_serveur_profile_payload";

/**
 * Modifie le profil serveur d'un utilisateur. Permission: user.update
 */
export class UpdateUserServeurProfileUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, payload: UpdateUserServeurProfilePayload): Promise<string | null> {
        return this.repository.updateUserServeurProfile(user_id, payload);
    }
}
