import { UserManagementRepository } from "../repositories/user_management_repository";
import { CreateUserPayload } from "@/modules/user/user_management/domain/types/create_user_payload";
import { UserBasic } from "@/modules/user/types/user_basic_types";

/**
 * Crée un utilisateur via le Saga Pattern Auth+User. Permission: user.create
 */
export class CreateUserUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(payload: CreateUserPayload): Promise<UserBasic | null> {
        return this.repository.createUser(payload);
    }
}
