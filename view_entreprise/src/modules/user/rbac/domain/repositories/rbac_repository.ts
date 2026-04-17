/**
 * RbacRepository – Contrat de persistance pour l'entité Rbac
 * 
 * **Rôle** : Interface abstraite utilisée par les UseCases.
 * 
 * **Implémentations** :
 * - `RbacRepositoryImpl` (couche data)
 * - Mock pour tests
 * 
 * **Généré automatiquement** à partir des UseCases du module **user**.
 * 
 * @example
 * const repo: RbacRepository = container.get(RbacRepository);
 * const user = await repo.getUserById("123");
 */
export interface RbacRepository {
    /**
    * Liste toutes les permissions disponibles dans le système. Permission: permission.list
    *
   * @returns Liste de toutes les permissions du système
    */
    getPermissionsList(): Promise<object[] | null>;

  /**
    * Liste les rôles assignables dans le système. Permission: role.list
    *
   * @returns Liste des rôles assignables
    */
    getRolesList(): Promise<object[] | null>;

  /**
    * Liste les catégories de permissions pour affichage groupé dans le frontend. Permission: permission.list
    *
   * @returns Catégories de permissions groupées
    */
    getPermissionsCategories(): Promise<object[] | null>;
}
