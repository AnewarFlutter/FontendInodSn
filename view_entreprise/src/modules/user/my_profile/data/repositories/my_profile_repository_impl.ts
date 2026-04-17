import { UpdateMyProfilePayload } from "@/modules/user/my_profile/domain/types/update_my_profile_payload";
import { UserDetail } from "@/modules/user/types/user_detail_types";
import { MyProfileRepository } from "../../domain/repositories/my_profile_repository";
import { MyProfileDataSource } from "../datasources/my_profile_data_source";

/**
 * Implémentation concrète du repository pour my_profile.
 * Délègue l'accès aux données à un datasource et mappe entre Model et Entity.
 */
export class MyProfileRepositoryImpl implements MyProfileRepository {
    constructor(private ds: MyProfileDataSource) { }


    /**
     * Récupère le profil complet de l'administrateur connecté (infos personnelles + profils métier + rôles)
     */
    async getMyProfile(): Promise<UserDetail | null> {

        try {
            const data = await this.ds.getMyProfile();
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Met à jour le profil personnel de l'administrateur connecté
     */
    async updateMyProfile(payload: UpdateMyProfilePayload): Promise<string | null> {

        try {
            const data = await this.ds.updateMyProfile(payload);
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Récupère les rôles actifs de l'administrateur connecté
     */
    async getMyRoles(): Promise<object[] | null> {

        try {
            const data = await this.ds.getMyRoles();
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Récupère les permissions effectives de l'administrateur connecté (rôles + permissions individuelles)
     */
    async getMyPermissions(): Promise<string[] | null> {

        try {
            const data = await this.ds.getMyPermissions();
            // TODO: Mapper les données si nécessaire, ex: data.toEntity() ou data.map(d => d.toEntity())
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Upload de la photo de profil de l'administrateur connecté (multipart/form-data)
     */
    async uploadMyAvatar(photo: File): Promise<string | null> {

        try {
            const data = await this.ds.uploadMyAvatar(photo);
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Modifier son propre numéro de téléphone
     */
    async updateMyPhone(user_id: string, new_phone: string): Promise<string | null> {

        try {
            const data = await this.ds.updateMyPhone(user_id, new_phone);
            return data;
        } catch (e) {
            throw e;
        }

    }

    /**
     * Changer le mot de passe de l'utilisateur connecté
     */
    async changePassword(old_password: string, new_password: string): Promise<string | null> {

        try {
            const data = await this.ds.changePassword(old_password, new_password);
            return data;
        } catch (e) {
            throw e;
        }

    }
}
