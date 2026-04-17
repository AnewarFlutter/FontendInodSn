import { GenderEnum } from "@/modules/user/enums/gender_enum";
import { UserRoleCodeEnum } from "@/modules/user/enums/user_role_code_enum";

/**

/**
 * CreateUserPayload
 * 
 * Type personnalisé
 */
export type CreateUserPayload = {

email?: string | null;

phone?: string | null;

first_name: string;

last_name: string;

gender?: GenderEnum | null;

birth_date?: string | null;

nationality?: string | null;

roles?: UserRoleCodeEnum[];
};
