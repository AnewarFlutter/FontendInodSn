import { UserManagementRepository } from "../repositories/user_management_repository";
import { UpdateUserCaissierProfilePayload } from "@/modules/user/user_management/domain/types/update_user_caissier_profile_payload";

/**
 * Modifie le profil caissier d'un utilisateur. Permission: user.update
 */
export class UpdateUserCaissierProfileUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, payload: UpdateUserCaissierProfilePayload): Promise<string | null> {
        return this.repository.updateUserCaissierProfile(user_id, payload);
    }
}
