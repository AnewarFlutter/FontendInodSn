import { MyProfileRepository } from "../repositories/my_profile_repository";
import { UpdateMyProfilePayload } from "@/modules/user/my_profile/domain/types/update_my_profile_payload";

/**
 * Met à jour le profil personnel de l'administrateur connecté
 */
export class UpdateMyProfileUseCase {
    constructor(private readonly repository: MyProfileRepository) {}

    /**
     * Executes the use case.
     */
    async execute(payload: UpdateMyProfilePayload): Promise<string | null> {
        return this.repository.updateMyProfile(payload);
    }
}
