import { SessionRepository } from "../repositories/session_repository";
import { LoginPayload } from "@/modules/auth/session/domain/types/login_payload";
import { LoginResponseData } from "@/modules/auth/types/login_response_data_types";
import { TokenPair } from "@/modules/auth/types/token_pair_types";
import { LoginUserWrapper } from "@/modules/auth/types/login_user_wrapper_types";
import { UserProfileData } from "@/modules/auth/types/user_profile_data_types";
import { CurrentRole } from "@/modules/auth/types/current_role_types";
import { RolePermissions } from "@/modules/auth/types/role_permissions_types";

/**
 * Authentification d'un utilisateur avec email ou téléphone et contexte de rôle
 */
export class LoginUseCase {
    constructor(private readonly repository: SessionRepository) {}

    /**
     * Executes the use case.
     */
    async execute(payload: LoginPayload): Promise<LoginResponseData | null> {
        return this.repository.login(payload);
    }
}
