/**
* LoginContextEnum
*
* **Énumération** de la scopeName **Auth**
*
* Contextes de connexion disponibles dans l'application restauration
*
* @example
* Usage dans une entité
* const status: LoginContextEnum = LoginContextEnum.M;
*
* @example
* Vérification
* if (status === LoginContextEnum.ADMIN) { ... }
*/
export enum LoginContextEnum {
 /** Espace administrateur */
    ADMIN = "ADMIN",
 /** Espace caisse */
    CAISSE = "CAISSE",
 /** Espace cuisine */
    CUISINE = "CUISINE",
 /** Espace service en salle */
    SERVICE = "SERVICE",
 /** Espace livraison */
    LIVRAISON = "LIVRAISON"
}
