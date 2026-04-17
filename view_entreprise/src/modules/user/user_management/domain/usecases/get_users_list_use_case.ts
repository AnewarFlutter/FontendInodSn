import { UserManagementRepository } from "../repositories/user_management_repository";
import { PaginatedUsers } from "@/modules/user/types/paginated_users_types";

/**
 * Liste tous les utilisateurs. Permission: user.view_all
 */
export class GetUsersListUseCase {
    constructor(private readonly repository: UserManagementRepository) {}

    /**
     * Executes the use case.
     */
    async execute(page?: number, page_size?: number, search?: string): Promise<PaginatedUsers | null> {
        return this.repository.getUsersList(page, page_size, search);
    }
}
