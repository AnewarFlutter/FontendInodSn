import { LoginContextEnum } from "@/modules/auth/enums/login_context_enum";

/**

/**
 * AuthUserBasic
 * 
 * Type personnalisé
 */
export type AuthUserBasic = {

auth_user_id: string;

email?: string | null;

phone?: string | null;

is_active: boolean;

context?: LoginContextEnum | null;
};
