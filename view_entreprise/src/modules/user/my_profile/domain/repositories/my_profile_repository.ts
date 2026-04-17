import { UserDetail } from "@/modules/user/types/user_detail_types";
import { UpdateMyProfilePayload } from "@/modules/user/my_profile/domain/types/update_my_profile_payload";

/**
 * MyProfileRepository – Contrat de persistance pour l'entité MyProfile
 * 
 * **Rôle** : Interface abstraite utilisée par les UseCases.
 * 
 * **Implémentations** :
 * - `MyProfileRepositoryImpl` (couche data)
 * - Mock pour tests
 * 
 * **Généré automatiquement** à partir des UseCases du module **user**.
 * 
 * @example
 * const repo: MyProfileRepository = container.get(MyProfileRepository);
 * const user = await repo.getUserById("123");
 */
export interface MyProfileRepository {
    /**
    * Récupère le profil complet de l'administrateur connecté (infos personnelles + profils métier + rôles)
    *
   * @returns Profil complet de l'admin connecté
    */
    getMyProfile(): Promise<UserDetail | null>;

  /**
    * Met à jour le profil personnel de l'administrateur connecté
    *
   * @param payload 
   * @returns Confirmation de la mise à jour du profil
    */
    updateMyProfile(payload: UpdateMyProfilePayload): Promise<string | null>;

  /**
    * Récupère les rôles actifs de l'administrateur connecté
    *
   * @returns Liste des rôles actifs
    */
    getMyRoles(): Promise<object[] | null>;

  /**
    * Récupère les permissions effectives de l'administrateur connecté (rôles + permissions individuelles)
    *
   * @returns Liste des permissions effectives
    */
    getMyPermissions(): Promise<string[] | null>;

  /**
    * Upload de la photo de profil de l'administrateur connecté (multipart/form-data). Le File est passé directement à travers la Server Action — Next.js sérialise les File nativement.
    *
   * @param photo Fichier image sélectionné par l'utilisateur (JPEG, PNG, WebP — max 5 Mo)
   * @returns URL absolue de l'avatar uploadé (origin API + chemin relatif retourné par l'API)
    */
    uploadMyAvatar(photo: File): Promise<string | null>;

  /**
    * Modifier son propre numéro de téléphone (via endpoint admin avec l'ID du user connecté)
    *
   * @param user_id ID de l'utilisateur connecté
   * @param new_phone Nouveau numéro de téléphone
   * @returns Confirmation de la mise à jour du téléphone
    */
    updateMyPhone(user_id: string, new_phone: string): Promise<string | null>;

  /**
    * Changer le mot de passe de l'utilisateur connecté
    *
   * @param old_password Ancien mot de passe
   * @param new_password Nouveau mot de passe
   * @returns Message de confirmation
    */
    changePassword(old_password: string, new_password: string): Promise<string | null>;
}
