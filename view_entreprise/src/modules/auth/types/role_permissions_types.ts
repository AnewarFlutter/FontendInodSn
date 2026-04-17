import { RolePermissionsCustom } from "@/modules/auth/types/role_permissions_custom_types";

/**

/**
 * RolePermissions
 * 
 * Type personnalisé
 */
export type RolePermissions = {

base: string[];

custom: RolePermissionsCustom;
};
