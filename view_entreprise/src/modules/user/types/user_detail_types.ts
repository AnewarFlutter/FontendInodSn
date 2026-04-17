import { GenderEnum } from "@/modules/user/enums/gender_enum";

/**

/**
 * UserDetail
 * 
 * Type personnalisé
 */
export type UserDetail = {

id: string;

auth_user_id: string;

email?: string | null;

first_name: string;

last_name: string;

telephone?: string | null;

gender?: GenderEnum | null;

birth_date?: string | null;

address?: string | null;

nationality?: string | null;

avatar?: string | null;

is_active: boolean;

roles: object[];

permissions?: string[];

created_at: string;
};
