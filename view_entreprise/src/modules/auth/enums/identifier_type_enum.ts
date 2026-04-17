/**
* IdentifierTypeEnum
*
* **Énumération** de la scopeName **Auth**
*
* Type d'identifiant utilisé pour la connexion
*
* @example
* Usage dans une entité
* const status: IdentifierTypeEnum = IdentifierTypeEnum.M;
*
* @example
* Vérification
* if (status === IdentifierTypeEnum.email) { ... }
*/
export enum IdentifierTypeEnum {
 /** Connexion par adresse email */
    email = "email",
 /** Connexion par numéro de téléphone */
    phone = "phone"
}
