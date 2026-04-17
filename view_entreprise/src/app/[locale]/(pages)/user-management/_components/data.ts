import { Permission, Role, User } from "./schema"

// Liste des modules
export const modules = [
  "Dashboard",
  "Commandes",
  "Inventaire",
  "Catégories",
  "Tables",
  "Utilisateurs",
  "Paramètres",
] as const

// Statuts utilisateur
export const statutsUtilisateur = ["Actif", "Inactif", "Suspendu"] as const

// Liste des permissions
export const permissionsData: Permission[] = [
  // Dashboard
  { id: 1, code: "dashboard.view", nom: "Voir le dashboard", description: "Accéder au tableau de bord", module: "Dashboard" },
  { id: 2, code: "dashboard.stats", nom: "Voir les statistiques", description: "Voir les statistiques globales", module: "Dashboard" },

  // Commandes
  { id: 3, code: "orders.view", nom: "Voir les commandes", description: "Consulter la liste des commandes", module: "Commandes" },
  { id: 4, code: "orders.create", nom: "Créer une commande", description: "Passer de nouvelles commandes", module: "Commandes" },
  { id: 5, code: "orders.edit", nom: "Modifier une commande", description: "Modifier les commandes existantes", module: "Commandes" },
  { id: 6, code: "orders.delete", nom: "Supprimer une commande", description: "Supprimer des commandes", module: "Commandes" },
  { id: 7, code: "orders.cancel", nom: "Annuler une commande", description: "Annuler des commandes en cours", module: "Commandes" },

  // Inventaire
  { id: 8, code: "inventory.view", nom: "Voir l'inventaire", description: "Consulter les stocks", module: "Inventaire" },
  { id: 9, code: "inventory.create", nom: "Ajouter un produit", description: "Ajouter de nouveaux produits", module: "Inventaire" },
  { id: 10, code: "inventory.edit", nom: "Modifier un produit", description: "Modifier les produits existants", module: "Inventaire" },
  { id: 11, code: "inventory.delete", nom: "Supprimer un produit", description: "Supprimer des produits", module: "Inventaire" },
  { id: 12, code: "inventory.adjust", nom: "Ajuster les stocks", description: "Effectuer des ajustements de stock", module: "Inventaire" },
  { id: 13, code: "inventory.suppliers", nom: "Gérer les fournisseurs", description: "Gérer la liste des fournisseurs", module: "Inventaire" },
  { id: 14, code: "inventory.purchases", nom: "Gérer les achats", description: "Créer et gérer les commandes d'achat", module: "Inventaire" },

  // Catégories
  { id: 15, code: "categories.view", nom: "Voir les catégories", description: "Consulter les catégories", module: "Catégories" },
  { id: 16, code: "categories.create", nom: "Créer une catégorie", description: "Ajouter de nouvelles catégories", module: "Catégories" },
  { id: 17, code: "categories.edit", nom: "Modifier une catégorie", description: "Modifier les catégories", module: "Catégories" },
  { id: 18, code: "categories.delete", nom: "Supprimer une catégorie", description: "Supprimer des catégories", module: "Catégories" },

  // Tables
  { id: 19, code: "tables.view", nom: "Voir les tables", description: "Consulter les tables", module: "Tables" },
  { id: 20, code: "tables.create", nom: "Créer une table", description: "Ajouter de nouvelles tables", module: "Tables" },
  { id: 21, code: "tables.edit", nom: "Modifier une table", description: "Modifier les tables", module: "Tables" },
  { id: 22, code: "tables.delete", nom: "Supprimer une table", description: "Supprimer des tables", module: "Tables" },
  { id: 23, code: "tables.zones", nom: "Gérer les zones", description: "Gérer les zones du restaurant", module: "Tables" },

  // Utilisateurs
  { id: 24, code: "users.view", nom: "Voir les utilisateurs", description: "Consulter la liste des utilisateurs", module: "Utilisateurs" },
  { id: 25, code: "users.create", nom: "Créer un utilisateur", description: "Ajouter de nouveaux utilisateurs", module: "Utilisateurs" },
  { id: 26, code: "users.edit", nom: "Modifier un utilisateur", description: "Modifier les utilisateurs", module: "Utilisateurs" },
  { id: 27, code: "users.delete", nom: "Supprimer un utilisateur", description: "Supprimer des utilisateurs", module: "Utilisateurs" },
  { id: 28, code: "users.roles", nom: "Gérer les rôles", description: "Créer et modifier les rôles", module: "Utilisateurs" },
  { id: 29, code: "users.permissions", nom: "Gérer les permissions", description: "Attribuer des permissions", module: "Utilisateurs" },

  // Paramètres
  { id: 30, code: "settings.view", nom: "Voir les paramètres", description: "Accéder aux paramètres", module: "Paramètres" },
  { id: 31, code: "settings.edit", nom: "Modifier les paramètres", description: "Modifier les paramètres système", module: "Paramètres" },
]

// Liste des rôles
export const rolesData: Role[] = [
  {
    id: 1,
    nom: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités",
    couleur: "#ef4444",
    permissionIds: permissionsData.map(p => p.id), // Toutes les permissions
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    nom: "Gérant",
    description: "Gestion du restaurant et des équipes",
    couleur: "#f97316",
    permissionIds: [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 19, 20, 21, 23, 24, 25, 26, 30],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    nom: "Serveur",
    description: "Prise de commandes et service en salle",
    couleur: "#22c55e",
    permissionIds: [1, 3, 4, 5, 19],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    nom: "Cuisinier",
    description: "Préparation des plats et gestion cuisine",
    couleur: "#3b82f6",
    permissionIds: [1, 3, 8, 12, 15],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    nom: "Caissier",
    description: "Encaissement et gestion de la caisse",
    couleur: "#a855f7",
    permissionIds: [1, 3, 4, 7, 19],
    createdAt: "2024-01-01T00:00:00Z",
  },
]


// Fonction helper pour obtenir les permissions d'un rôle
export const getPermissionsByRole = (roleId: number): Permission[] => {
  const role = rolesData.find(r => r.id === roleId)
  if (!role) return []
  return permissionsData.filter(p => role.permissionIds.includes(p.id))
}

// Fonction helper pour obtenir les permissions effectives d'un utilisateur
export const getEffectivePermissions = (user: User): Permission[] => {
  const role = rolesData.find(r => r.id === user.roleId)
  if (!role) return []

  // Permissions du rôle - permissions retirées + permissions supplémentaires
  const rolePermissionIds = role.permissionIds.filter(id => !user.permissionsRetirees.includes(id))
  const allPermissionIds = [...new Set([...rolePermissionIds, ...user.permissionsSupplementaires])]

  return permissionsData.filter(p => allPermissionIds.includes(p.id))
}

// Fonction helper pour obtenir les permissions par module
export const getPermissionsByModule = (module: string): Permission[] => {
  return permissionsData.filter(p => p.module === module)
}

// Fonction pour obtenir un rôle par son nom
export const getRoleByName = (name: string): Role | undefined => {
  return rolesData.find(r => r.nom === name)
}
