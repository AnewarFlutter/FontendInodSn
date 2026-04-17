import { MyProfileRepository } from "../repositories/my_profile_repository";

/**
 * Upload de la photo de profil de l'administrateur connecté (multipart/form-data). Le File est passé directement à travers la Server Action — Next.js sérialise les File nativement.
 */
export class UploadMyAvatarUseCase {
    constructor(private readonly repository: MyProfileRepository) {}

    /**
     * Executes the use case.
     */
    async execute(photo: File): Promise<string | null> {
        return this.repository.uploadMyAvatar(photo);
    }
}
