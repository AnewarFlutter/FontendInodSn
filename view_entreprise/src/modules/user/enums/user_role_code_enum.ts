/**
* UserRoleCodeEnum
*
* **Énumération** de la scopeName **User**
*
* Codes de rôles assignables dans l'application
*
* @example
* Usage dans une entité
* const status: UserRoleCodeEnum = UserRoleCodeEnum.M;
*
* @example
* Vérification
* if (status === UserRoleCodeEnum.ADMIN) { ... }
*/
export enum UserRoleCodeEnum {
 /** Administrateur */
    ADMIN = "ADMIN",
 /** Serveur en salle */
    SERVEUR = "SERVEUR",
 /** Livreur */
    LIVREUR = "LIVREUR",
 /** Cuisinier */
    CUISINIER = "CUISINIER",
 /** Caissier point de vente */
    CAISSIER_POS = "CAISSIER_POS",
 /** Manager */
    MANAGER = "MANAGER"
}
