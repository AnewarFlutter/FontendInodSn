import { LoginContextEnum } from "@/modules/auth/enums/login_context_enum";
import { RolePermissions } from "@/modules/auth/types/role_permissions_types";

/**

/**
 * CurrentRole
 * 
 * Type personnalisé
 */
export type CurrentRole = {
  /** Code du rôle ex: SUPER_ADMIN */

code: string;

name: string;

level: number;

context: LoginContextEnum;

permissions: RolePermissions;
};
