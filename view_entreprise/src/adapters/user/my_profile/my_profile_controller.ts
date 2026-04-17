// Controller pour la feature my_profile

import { GetMyProfileUseCase } from "@/modules/user/my_profile/domain/usecases/get_my_profile_use_case";
import { UpdateMyProfileUseCase } from "@/modules/user/my_profile/domain/usecases/update_my_profile_use_case";
import { GetMyRolesUseCase } from "@/modules/user/my_profile/domain/usecases/get_my_roles_use_case";
import { GetMyPermissionsUseCase } from "@/modules/user/my_profile/domain/usecases/get_my_permissions_use_case";
import { UploadMyAvatarUseCase } from "@/modules/user/my_profile/domain/usecases/upload_my_avatar_use_case";
import { UpdateMyPhoneUseCase } from "@/modules/user/my_profile/domain/usecases/update_my_phone_use_case";
import { ChangePasswordUseCase } from "@/modules/user/my_profile/domain/usecases/change_password_use_case";
import { UserDetail } from "@/modules/user/types/user_detail_types";
import { UpdateMyProfilePayload } from "@/modules/user/my_profile/domain/types/update_my_profile_payload";

/**
 * This class is an adapter for the my_profile feature.
 * It acts as an interface between the application and the my_profile feature.
 */
export class MyProfileController {
    constructor(
            private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly updateMyProfileUseCase: UpdateMyProfileUseCase,
    private readonly getMyRolesUseCase: GetMyRolesUseCase,
    private readonly getMyPermissionsUseCase: GetMyPermissionsUseCase,
    private readonly uploadMyAvatarUseCase: UploadMyAvatarUseCase,
    private readonly updateMyPhoneUseCase: UpdateMyPhoneUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase
    ) { }


    /**
     * Récupère le profil complet de l'administrateur connecté (infos personnelles + profils métier + rôles).
     */
    getMyProfile = async (): Promise<UserDetail | null> => {
        try {
            const res = await this.getMyProfileUseCase.execute();
            return res;
        } catch (e) {
            console.log(`Error while executing getMyProfile: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Met à jour le profil personnel de l'administrateur connecté.
     */
    updateMyProfile = async (payload: UpdateMyProfilePayload): Promise<string | null> => {
        try {
            const res = await this.updateMyProfileUseCase.execute(payload);
            return res;
        } catch (e) {
            console.log(`Error while executing updateMyProfile: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Récupère les rôles actifs de l'administrateur connecté.
     */
    getMyRoles = async (): Promise<object[] | null> => {
        try {
            const res = await this.getMyRolesUseCase.execute();
            return res;
        } catch (e) {
            console.log(`Error while executing getMyRoles: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Récupère les permissions effectives de l'administrateur connecté (rôles + permissions individuelles).
     */
    getMyPermissions = async (): Promise<string[] | null> => {
        try {
            const res = await this.getMyPermissionsUseCase.execute();
            return res;
        } catch (e) {
            console.log(`Error while executing getMyPermissions: ${e}`);
            // TODO : Gérer vos erreurs ici et retournez ce qu'il faut dans ce/ces cas
            return null;
        }
    }

    /**
     * Upload de la photo de profil de l'administrateur connecté (multipart/form-data). Le File est passé directement à travers la Server Action — Next.js sérialise les File nativement..
     */
    uploadMyAvatar = async (photo: File): Promise<string | null> => {
        try {
            const res = await this.uploadMyAvatarUseCase.execute(photo);
            return res;
        } catch (e) {
            console.log(`Error while executing uploadMyAvatar: ${e}`);
            return null;
        }
    }

    /**
     * Modifier son propre numéro de téléphone (synchronise avec Auth Service).
     */
    updateMyPhone = async (user_id: string, new_phone: string): Promise<string | null> => {
        try {
            const res = await this.updateMyPhoneUseCase.execute(user_id, new_phone);
            return res;
        } catch (e) {
            console.log(`Error while executing updateMyPhone: ${e}`);
            return null;
        }
    }

    /**
     * Changer le mot de passe de l'utilisateur connecté.
     */
    changePassword = async (old_password: string, new_password: string): Promise<string | null> => {
        try {
            const res = await this.changePasswordUseCase.execute(old_password, new_password);
            return res;
        } catch (e) {
            console.log(`Error while executing changePassword: ${e}`);
            return null;
        }
    }
}
