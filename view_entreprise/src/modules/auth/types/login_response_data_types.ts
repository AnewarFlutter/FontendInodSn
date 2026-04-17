import { TokenPair } from "@/modules/auth/types/token_pair_types";
import { LoginUserWrapper } from "@/modules/auth/types/login_user_wrapper_types";

/**

/**
 * LoginResponseData
 * 
 * Type personnalisé
 */
export type LoginResponseData = {
  /** Statut de la réponse : SUCCESS */

status: string;

message: string;

token: TokenPair;

user: LoginUserWrapper;
};
