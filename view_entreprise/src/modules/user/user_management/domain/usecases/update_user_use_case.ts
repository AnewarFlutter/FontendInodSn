import { UserManagementRepository } from "../repositories/user_management_repository";
import { UpdateUserPayload } from "@/modules/user/user_management/domain/types/update_user_payload";

/**
 * Modifie les informations d'un utilisateur. Permission: user.update
 */
export class UpdateUserUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, payload: UpdateUserPayload): Promise<string | null> {
        return this.repository.updateUser(user_id, payload);
    }
}
