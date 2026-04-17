import { IdentifierTypeEnum } from "@/modules/auth/enums/identifier_type_enum";
import { LoginContextEnum } from "@/modules/auth/enums/login_context_enum";

/**

/**
 * LoginPayload
 * 
 * Type personnalisé
 */
export type LoginPayload = {

identifier_type: IdentifierTypeEnum;
  /** Email ou numéro de téléphone */

identifier: string;

password: string;

context: LoginContextEnum;
};
