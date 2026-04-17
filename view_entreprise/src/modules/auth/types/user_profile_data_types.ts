import { CurrentRole } from "@/modules/auth/types/current_role_types";

/**

/**
 * UserProfileData
 * 
 * Type personnalisé
 */
export type UserProfileData = {

id: string;

auth_user_id: string;

email: string;

firstname: string;

lastname: string;

pseudo: string;

photo?: string | null;

gender?: string | null;

birth_date?: string | null;

telephone?: string | null;

created_at: string;

current_role: CurrentRole;

available_roles: CurrentRole[];
};
