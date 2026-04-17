import { UserStatsResponse } from "@/modules/user/stats/domain/types/user_stats_response";

/**
 * StatsDataSource – Contrat d'accès aux données brutes pour l'entité Stats
 * 
 * **Rôle** : Interface abstraite utilisée par le RepositoryImpl pour accéder aux données.
 * 
 * **Implémentations** :
 * - `RestApiStatsDataSourceImpl`
 * - `FirebaseStatsDataSourceImpl`
 * - Mock pour tests
 * 
 * **Généré automatiquement** à partir des UseCases du module **user**.
 * 
 * **Attention** : Utilise **ModelStats**, pas l'entité métier.
 * 
 * @example
 * const ds: StatsDataSource = new RestApiStatsDataSourceImpl();
 * const model = await ds.getUserById("123");
 */
export interface StatsDataSource {
    /**
    * Récupère les statistiques globales des utilisateurs (totaux, actifs/inactifs, répartition par rôle). Permission: user.view_stats
    *
   * @returns Statistiques globales des utilisateurs
    */
    getUserStats(): Promise<UserStatsResponse | null>;
}
