import { GenderEnum } from "@/modules/user/enums/gender_enum";

/**

/**
 * UpdateMyProfilePayload
 * 
 * Type personnalisé
 */
export type UpdateMyProfilePayload = {

first_name?: string;

last_name?: string;
  /** Format : YYYY-MM-DD */

birth_date?: string | null;

gender?: GenderEnum | null;

address?: string | null;

nationality?: string | null;
};
