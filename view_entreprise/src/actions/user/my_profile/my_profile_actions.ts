"use server";

/**
 * Ficher action prévu pour le module **user** et la feature **my_profile**.
 * Actions utilisées par les composants React pour interagir avec les UseCases via les controllers.
 * N'appelez pas de UseCases directement ici, mais via les controllers.
 * N'appelez jamais le controller depuis les composants React, seulement depuis les fichiers actions.
 */

import { featuresDi } from "@/di/features_di";
import { UpdateMyProfilePayload } from "@/modules/user/my_profile/domain/types/update_my_profile_payload";
import { UserDetail } from "@/modules/user/types/user_detail_types";
import { AppActionResult } from "@/shared/types/global";

// ─── Profil courant ─────────────────────────────────────────────────────────

export async function handleGetMyProfileAction(): Promise<AppActionResult<UserDetail | null>> {
    const result = await featuresDi.myProfileController.getMyProfile();

    if (!result) {
        return {
            success: false,
            message: "Impossible de récupérer votre profil.",
            data: null,
        };
    }

    return {
        success: true,
        message: "Profil récupéré avec succès.",
        data: result,
    };
}

export async function handleUploadMyAvatarAction(
    photo: File
): Promise<AppActionResult<string | null>> {
    if (!photo) {
        return { success: false, message: "Aucune image reçue.", data: null };
    }

    const result = await featuresDi.myProfileController.uploadMyAvatar(photo);

    if (!result) {
        return {
            success: false,
            message: "L'upload de l'avatar a échoué.",
            data: null,
        };
    }

    return {
        success: true,
        message: "Avatar mis à jour avec succès.",
        data: result,
    };
}

export async function handleUpdateMyProfileAction(
    payload: UpdateMyProfilePayload
): Promise<AppActionResult<string | null>> {
    const result = await featuresDi.myProfileController.updateMyProfile(payload);

    if (!result) {
        return {
            success: false,
            message: "La mise à jour du profil a échoué.",
            data: null,
        };
    }

    return {
        success: true,
        message: "Profil mis à jour avec succès.",
        data: result,
    };
}

export async function handleChangePasswordAction(
    old_password: string,
    new_password: string
): Promise<AppActionResult<string | null>> {
    if (!old_password || !new_password) {
        return { success: false, message: "Les champs mot de passe sont requis.", data: null };
    }

    const result = await featuresDi.myProfileController.changePassword(old_password, new_password);

    if (!result) {
        return {
            success: false,
            message: "La modification du mot de passe a échoué.",
            data: null,
        };
    }

    return {
        success: true,
        message: "Mot de passe modifié avec succès.",
        data: result,
    };
}

export async function handleUpdateMyPhoneAction(
    user_id: string,
    new_phone: string
): Promise<AppActionResult<string | null>> {
    if (!new_phone) {
        return { success: false, message: "Numéro de téléphone manquant.", data: null };
    }

    const result = await featuresDi.myProfileController.updateMyPhone(user_id, new_phone);

    if (!result) {
        return {
            success: false,
            message: "La mise à jour du téléphone a échoué.",
            data: null,
        };
    }

    return {
        success: true,
        message: "Téléphone mis à jour avec succès.",
        data: result,
    };
}
