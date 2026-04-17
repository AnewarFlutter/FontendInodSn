import { UserManagementRepository } from "../repositories/user_management_repository";
import { UpdateUserCuisinierProfilePayload } from "@/modules/user/user_management/domain/types/update_user_cuisinier_profile_payload";

/**
 * Modifie le profil cuisinier d'un utilisateur. Permission: user.update
 */
export class UpdateUserCuisinierProfileUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, payload: UpdateUserCuisinierProfilePayload): Promise<string | null> {
        return this.repository.updateUserCuisinierProfile(user_id, payload);
    }
}
