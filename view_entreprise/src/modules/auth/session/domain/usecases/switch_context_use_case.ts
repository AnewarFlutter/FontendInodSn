import { SessionRepository } from "../repositories/session_repository";
import { SwitchContextPayload } from "@/modules/auth/session/domain/types/switch_context_payload";
import { LoginResponseData } from "@/modules/auth/types/login_response_data_types";

/**
 * Change le contexte (rôle) de l'utilisateur connecté. Retourne de nouveaux tokens avec le contexte mis à jour.
 */
export class SwitchContextUseCase {
    constructor(private readonly repository: SessionRepository) {}

    /**
     * Executes the use case.
     */
    async execute(payload: SwitchContextPayload): Promise<LoginResponseData | null> {
        return this.repository.switchContext(payload);
    }
}
