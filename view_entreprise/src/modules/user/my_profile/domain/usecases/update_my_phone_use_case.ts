import { MyProfileRepository } from "../repositories/my_profile_repository";

/**
 * Modifier son propre numéro de téléphone (via endpoint admin avec l'ID du user connecté). Synchronise avec Auth Service.
 */
export class UpdateMyPhoneUseCase {
    constructor(private readonly repository: MyProfileRepository) {}

    /**
     * Executes the use case.
     */
    async execute(user_id: string, new_phone: string): Promise<string | null> {
        return this.repository.updateMyPhone(user_id, new_phone);
    }
}
