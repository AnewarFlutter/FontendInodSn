import { MyProfileRepository } from "../repositories/my_profile_repository";
import { UserDetail } from "@/modules/user/types/user_detail_types";

/**
 * Récupère le profil complet de l'administrateur connecté (infos personnelles + profils métier + rôles)
 */
export class GetMyProfileUseCase {
    constructor(private readonly repository: MyProfileRepository) {}

    /**
     * Executes the use case.
     */
    async execute(): Promise<UserDetail | null> {
        return this.repository.getMyProfile();
    }
}
