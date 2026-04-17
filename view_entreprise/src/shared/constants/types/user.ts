// Objet permission individuel (retourné dans base, custom.added, custom.removed)
export interface UserDetailPermissionObject {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  category_name: string;
  is_active: boolean;
  is_system: boolean;
  created_at: string;
}

// Groupe de permissions par catégorie — ex: { "CATEGORY": [...], "CONFIG": [...] }
export type UserDetailPermissionsGrouped = Record<string, UserDetailPermissionObject[]>;

// Structure complète des permissions d'un utilisateur
export interface UserDetailPermissions {
  base: UserDetailPermissionsGrouped;
  custom: {
    added: UserDetailPermissionsGrouped;
    removed: UserDetailPermissionsGrouped;
  };
  summary: {
    total_base: number;
    total_custom_added: number;
    total_custom_removed: number;
    total_effective: number;
  };
}

// Rôle assigné (code remplace id)
export interface UserDetailRoleItem {
  code: string;
  name: string;
  assigned_at: string;
  assigned_by: string;
}

export interface USER_GET_MY_PROFILE_RESPONSE_200 {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  telephone?: string;
  birth_date?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  photo?: string;
  status_activation: string;
  active_role?: string;
  active_profile?: { [key: string]: unknown };
  permissions: string[];
  created_at: string;
  updated_at: string;
}
export interface USER_GET_MY_PROFILE_RESPONSE_401 {
  detail: string;
}
export interface USER_GET_MY_PROFILE_RESPONSE_404 {
  detail: string;
}
export interface USER_UPDATE_MY_PROFILE_PARAMS {
  body: {
    first_name?: string;
    last_name?: string;
    telephone?: string;
    birth_date?: string;
    gender?: string;
    address?: string;
    nationality?: string;
  };


}
export interface USER_UPDATE_MY_PROFILE_RESPONSE_200 {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  telephone?: string;
  birth_date?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  photo?: string;
  status_activation: string;
  active_role?: string;
  active_profile?: { [key: string]: unknown };
  permissions: string[];
  created_at: string;
  updated_at: string;
}
export interface USER_UPDATE_MY_PROFILE_RESPONSE_400 {
  status: string;
  message: string;
  errors?: { [key: string]: unknown };
}
export interface USER_UPDATE_MY_PROFILE_RESPONSE_401 {
  detail: string;
}
export interface USER_UPLOAD_MY_AVATAR_PARAMS {
  body: {
    avatar: File;
  };


}
export interface USER_UPLOAD_MY_AVATAR_RESPONSE_200 {
  message: string;
  photo: string;
  filename: string;
  size: string;
}
export interface USER_UPLOAD_MY_AVATAR_RESPONSE_400 {
  error: string;
}
export interface USER_UPDATE_MY_PHONE_PARAMS {
  path: { user_id: string };
  body: { new_phone: string };
}
export interface USER_UPDATE_MY_PHONE_RESPONSE_200 {
  message: string;
}
export interface USER_UPDATE_MY_PHONE_RESPONSE_400 {
  error: string;
  code: string;
}
export interface USER_UPDATE_MY_PHONE_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_GET_MY_ROLES_RESPONSE_200 {
  count: number;
  roles: {
    id: string;
    role: string;
    role_name: string;
    role_description: string;
    statut: string;
    attributed_by: string;
    date_attribution: string;
    expires_at: string;
  }[];
}
export interface USER_GET_MY_ROLES_RESPONSE_401 {
  detail: string;
}
export interface USER_GET_MY_PERMISSIONS_RESPONSE_200 {
  count: number;
  permissions: {
    id: string;
    code: string;
    name: string;
    description: string;
    category: string;
    is_active: boolean;
    is_system: boolean;
    created_at: string;
  }[];
}
export interface USER_GET_MY_PERMISSIONS_RESPONSE_401 {
  detail: string;
}
export interface USER_GET_USERS_LIST_PARAMS {

  query: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: string;
    status?: string;
  };

}
export interface USER_GET_USERS_LIST_RESPONSE_200 {
  data: {
    count: number;
    page: number;
    page_size: number;
    results: {
      id: string;
      email: string;
      telephone: string;
      first_name: string;
      last_name: string;
      status_activation: string;
      roles: string[];
      created_at: string;
    }[];
  };
}
export interface USER_GET_USERS_LIST_RESPONSE_401 {
  detail: string;
}
export interface USER_GET_USERS_LIST_RESPONSE_403 {
  detail: string;
}
export interface USER_GET_USER_DETAIL_PARAMS {


  path: {
    user_id: string;
  };
}
export interface USER_GET_USER_DETAIL_RESPONSE_200 {
  data: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    pseudo: string;
    photo: string;
    telephone: string;
    birth_date: string;
    gender?: string;
    nationality?: string;
    address?: string;
    status_activation: string;
    status_verification: string;
    preferences: { [key: string]: unknown };
    is_deleted: boolean;
    deleted_at: string;
    roles: {
      code: string;
      name: string;
      assigned_at: string;
      assigned_by: string;
    }[];
    permissions: {
      base: { [key: string]: unknown };
      custom: {
        added: { [key: string]: unknown };
        removed: { [key: string]: unknown };
      };
      summary: {
        total_base: number;
        total_custom_added: number;
        total_custom_removed: number;
        total_effective: number;
      };
    };
    profiles: {
      cuisinier: { [key: string]: unknown };
      serveur: { [key: string]: unknown };
      livreur: { [key: string]: unknown };
      caissier: { [key: string]: unknown };
      default: { [key: string]: unknown };
    };
    created_at: string;
    updated_at: string;
  };
}
export interface USER_GET_USER_DETAIL_RESPONSE_403 {
  detail: string;
}
export interface USER_GET_USER_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface USER_CREATE_USER_PARAMS {
  body: {
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    address: string;
    roles: string[];
    telephone?: string;
    birth_date?: string;
    nationality?: string;
  };


}
export interface USER_CREATE_USER_RESPONSE_200 {
  status: string;
  message: string;
  data: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    status_activation: string;
    roles: { [key: string]: unknown }[];
  };
}
export interface USER_CREATE_USER_RESPONSE_400 {
  error: string;
  code: string;
  details: { [key: string]: unknown[] };
}
export interface USER_CREATE_USER_RESPONSE_403 {
  detail: string;
}
export interface USER_CREATE_USER_RESPONSE_500 {
  error: string;
  code: string;
}
export interface USER_UPDATE_USER_PARAMS {
  body: {
    first_name?: string;
    last_name?: string;
    telephone?: string;
    birth_date?: string;
    gender?: string;
    address?: string;
    nationality?: string;
  };

  path: {
    user_id: string;
  };
}
export interface USER_UPDATE_USER_RESPONSE_200 {
  data: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    pseudo: string;
    photo: string;
    telephone: string;
    birth_date: string;
    gender?: string;
    nationality?: string;
    address?: string;
    status_activation: string;
    status_verification: string;
    preferences: { [key: string]: unknown };
    is_deleted: boolean;
    deleted_at: string;
    roles: { [key: string]: unknown }[];
    permissions: string[];
  };
}
export interface USER_UPDATE_USER_RESPONSE_400 {
  error: string;
  code: string;
  details?: { [key: string]: unknown };
}
export interface USER_UPDATE_USER_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_UPDATE_USER_EMAIL_PARAMS {
  body: {
    new_email: string;
  };

  path: {
    user_id: string;
  };
}
export interface USER_UPDATE_USER_EMAIL_RESPONSE_200 {
  message: string;
}
export interface USER_UPDATE_USER_EMAIL_RESPONSE_400 {
  error: string;
  code: string;
}
export interface USER_UPDATE_USER_EMAIL_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_UPDATE_USER_PHONE_PARAMS {
  body: {
    new_phone: string;
  };

  path: {
    user_id: string;
  };
}
export interface USER_UPDATE_USER_PHONE_RESPONSE_200 {
  message: string;
}
export interface USER_UPDATE_USER_PHONE_RESPONSE_400 {
  error: string;
  code: string;
}
export interface USER_UPDATE_USER_PHONE_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_SOFT_DELETE_USER_PARAMS {


  path: {
    user_id: string;
  };
}
export interface USER_SOFT_DELETE_USER_RESPONSE_200 {
  message: string;
  data: {
    success: boolean;
    user_id: string;
    email: string;
    is_deleted: boolean;
    deleted_at: string;
    reason: string;
  };
}
export interface USER_SOFT_DELETE_USER_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_RESTORE_USER_PARAMS {


  path: {
    user_id: string;
  };
}
export interface USER_RESTORE_USER_RESPONSE_200 {
  message: string;
  data: {
    success: boolean;
    user_id: string;
    email: string;
    is_deleted: boolean;
    status_activation: string;
  };
}
export interface USER_RESTORE_USER_RESPONSE_400 {
  error: string;
  code: string;
}
export interface USER_RESTORE_USER_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_SUSPEND_USER_PARAMS {
  body: {
    reason?: string;
  };

  path: {
    user_id: string;
  };
}
export interface USER_SUSPEND_USER_RESPONSE_200 {
  message: string;
  data: {
    success: boolean;
    user_id: string;
    email: string;
    status_activation: string;
    reason: string;
  };
}
export interface USER_SUSPEND_USER_RESPONSE_400 {
  error: string;
  code: string;
}
export interface USER_SUSPEND_USER_RESPONSE_403 {
  detail: string;
}
export interface USER_SUSPEND_USER_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_ACTIVATE_USER_PARAMS {


  path: {
    user_id: string;
  };
}
export interface USER_ACTIVATE_USER_RESPONSE_200 {
  message: string;
  data: {
    success: boolean;
    user_id: string;
    email: string;
    status_activation: string;
    reason: string;
  };
}
export interface USER_ACTIVATE_USER_RESPONSE_400 {
  error: string;
  code: string;
}
export interface USER_ACTIVATE_USER_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_ACTIVATE_USER_LIVREUR_PROFILE_PARAMS {
  body: {
    type_vehicule: string;
    numero_permis: string;
    photo_permis: string;
    date_emission_permis: string;
    date_expiration_permis: string;
    immatriculation: string;
  };

  path: {
    user_id: string;
  };
}
export interface USER_ACTIVATE_USER_LIVREUR_PROFILE_RESPONSE_200 {
  message: string;
  data: { [key: string]: unknown };
}
export interface USER_ACTIVATE_USER_LIVREUR_PROFILE_RESPONSE_400 {
  error: string;
  code: string;
  details: {
    missing_fields: string[];
  };
}
export interface USER_ACTIVATE_USER_LIVREUR_PROFILE_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_UPDATE_USER_CUISINIER_PROFILE_PARAMS {
  body: {
    specialites?: string[];
    poste_principal?: string;
    allergenes_maitrises?: string[];
  };

  path: {
    user_id: string;
  };
}
export interface USER_UPDATE_USER_CUISINIER_PROFILE_RESPONSE_200 {
  message: string;
  data: {
    id: string;
    user: string;
    specialites: string[];
    poste_principal: string;
    allergenes_maitrises: string[];
    created_at: string;
    updated_at: string;
  };
}
export interface USER_UPDATE_USER_CUISINIER_PROFILE_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_UPDATE_USER_SERVEUR_PROFILE_PARAMS {
  body: {
    sections_assignees?: string[];
    tables_assignees?: number[];
    langues_parlees?: string[];
  };

  path: {
    user_id: string;
  };
}
export interface USER_UPDATE_USER_SERVEUR_PROFILE_RESPONSE_200 {
  message: string;
  data: { [key: string]: unknown };
}
export interface USER_UPDATE_USER_SERVEUR_PROFILE_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_UPDATE_USER_CAISSIER_PROFILE_PARAMS {
  body: {
    pos_terminal_id?: string;
    assigned_cash_register?: string;
    last_cash_register_opening?: string;
  };

  path: {
    user_id: string;
  };
}
export interface USER_UPDATE_USER_CAISSIER_PROFILE_RESPONSE_200 {
  message: string;
  data: { [key: string]: unknown };
}
export interface USER_UPDATE_USER_CAISSIER_PROFILE_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_UPDATE_USER_LIVREUR_PROFILE_PARAMS {
  body: {
    type_vehicule?: string;
    immatriculation?: string;
    zones_livraison?: string[];
    disponible?: boolean;
  };

  path: {
    user_id: string;
  };
}
export interface USER_UPDATE_USER_LIVREUR_PROFILE_RESPONSE_200 {
  message: string;
  data: { [key: string]: unknown };
}
export interface USER_UPDATE_USER_LIVREUR_PROFILE_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_UPDATE_USER_MANAGER_PROFILE_PARAMS {
  body: {
    notes?: string;
    responsabilites?: string[];
  };

  path: {
    user_id: string;
  };
}
export interface USER_UPDATE_USER_MANAGER_PROFILE_RESPONSE_200 {
  message: string;
  data: { [key: string]: unknown };
}
export interface USER_UPDATE_USER_MANAGER_PROFILE_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_ASSIGN_USER_ROLES_PARAMS {
  body: {
    roles: string[];
  };

  path: {
    user_id: string;
  };
}
export interface USER_ASSIGN_USER_ROLES_RESPONSE_200 {
  message: string;
  data: {
    user_id: string;
    email: string;
    assigned_roles: string[];
    already_assigned: string[];
    current_roles: string[];
  };
}
export interface USER_ASSIGN_USER_ROLES_RESPONSE_400 {
  error: string;
  code: string;
}
export interface USER_ASSIGN_USER_ROLES_RESPONSE_403 {
  detail: string;
}
export interface USER_ASSIGN_USER_ROLES_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_REVOKE_USER_ROLES_PARAMS {
  body: {
    roles: string[];
  };

  path: {
    user_id: string;
  };
}
export interface USER_REVOKE_USER_ROLES_RESPONSE_200 {
  message: string;
  data: {
    user_id: string;
    email: string;
    revoked_roles: string[];
    not_assigned: string[];
    remaining_roles: string[];
  };
}
export interface USER_REVOKE_USER_ROLES_RESPONSE_400 {
  error: string;
  code: string;
}
export interface USER_REVOKE_USER_ROLES_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_GRANT_USER_PERMISSIONS_PARAMS {
  body: {
    permissions: string[];
  };

  path: {
    user_id: string;
  };
}
export interface USER_GRANT_USER_PERMISSIONS_RESPONSE_200 {
  message: string;
  data: {
    user_id: string;
    email: string;
    granted_permissions: string[];
    already_granted: string[];
    current_permissions: string[];
  };
}
export interface USER_GRANT_USER_PERMISSIONS_RESPONSE_400 {
  error: string;
  code: string;
}
export interface USER_GRANT_USER_PERMISSIONS_RESPONSE_403 {
  detail: string;
}
export interface USER_GRANT_USER_PERMISSIONS_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_REVOKE_USER_PERMISSIONS_PARAMS {
  body: {
    permissions: string[];
  };

  path: {
    user_id: string;
  };
}
export interface USER_REVOKE_USER_PERMISSIONS_RESPONSE_200 {
  message: string;
  data: {
    user_id: string;
    email: string;
    revoked_permissions: string[];
    not_found: string[];
    remaining_permissions: string[];
  };
}
export interface USER_REVOKE_USER_PERMISSIONS_RESPONSE_400 {
  error: string;
  code: string;
}
export interface USER_REVOKE_USER_PERMISSIONS_RESPONSE_403 {
  detail: string;
}
export interface USER_REVOKE_USER_PERMISSIONS_RESPONSE_404 {
  error: string;
  code: string;
}
export interface USER_GET_ROLES_LIST_RESPONSE_200 {
  data: {
    count: number;
    user_level: number;
    assignable_roles: {
      code: string;
      name: string;
      level: number;
    }[];
  };
}
export interface USER_GET_ROLES_LIST_RESPONSE_403 {
  error: string;
  code: string;
}
export interface USER_GET_PERMISSIONS_LIST_RESPONSE_200 {
  data: {
    count: number;
    user_level: number;
    filtered: boolean;
    permissions: {
      id: string;
      code: string;
      name: string;
      description: string;
      category: string;
      is_active: boolean;
      is_system: boolean;
      created_at: string;
    }[];
    categories: string[];
  };
}
export interface USER_GET_PERMISSIONS_LIST_RESPONSE_403 {
  error: string;
  code: string;
}
export interface USER_GET_PERMISSIONS_CATEGORIES_RESPONSE_200 {
  data: {
    count: number;
    user_level: number;
    filtered: boolean;
    categories: string[];
  };
}
export interface USER_GET_PERMISSIONS_CATEGORIES_RESPONSE_403 {
  error: string;
  code: string;
}
export interface USER_GET_USER_STATS_RESPONSE_200 {
  message: string;
  data: {
    total_users: number;
    active_users: number;
    suspended_users: number;
    deactivated_users: number;
    pending_users: number;
    inactive_users: number;
    deleted_users: number;
    by_role: { [key: string]: number };
    by_gender: { [key: string]: number };
  };
}
export interface USER_GET_USER_STATS_RESPONSE_403 {
  error: string;
  code: string;
}

