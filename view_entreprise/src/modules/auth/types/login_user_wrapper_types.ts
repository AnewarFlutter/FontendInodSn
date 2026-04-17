import { UserProfileData } from "@/modules/auth/types/user_profile_data_types";

/**

/**
 * LoginUserWrapper
 * 
 * Type personnalisé
 */
export type LoginUserWrapper = {

data: UserProfileData;

email_verified: boolean;

is_active: boolean;
};
