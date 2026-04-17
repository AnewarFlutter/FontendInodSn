/**

/**
 * TokenPair
 * 
 * Type personnalisé
 */
export type TokenPair = {

access_token: string;

refresh_token: string;
  /** Type de token : Bearer */

token_type: string;
  /** Durée de validité du access_token en secondes */

expires_in: number;
};
