import { UserManagementRepository } from "../repositories/user_management_repository";
import { UserDetail } from "@/modules/user/types/user_detail_types";

/**
 * Récupère les détails complets d'un utilisateur. Permission: user.view_all
 */
export class GetUserDetailUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string): Promise<UserDetail | null> {
        return this.repository.getUserDetail(user_id);
    }
}
