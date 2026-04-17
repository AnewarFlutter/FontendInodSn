/**

/**
 * UserBasic
 * 
 * Type personnalisé
 */
export type UserBasic = {

id: string;

auth_user_id: string;

email?: string | null;

first_name: string;

last_name: string;

telephone?: string | null;

is_active: boolean;

roles?: string[] | { code: string }[];
};
