"use server";

import { featuresDi } from "@/di/features_di";
import { AppActionResult } from "@/shared/types/global";

export type ApiRole = { code: string; name: string; level: number }

export type ApiPermission = {
  code: string;
  name: string;
  category?: string;
  description?: string;
}

export async function handleGetRolesListAction(): Promise<AppActionResult<ApiRole[] | null>> {
  try {
    const result = await featuresDi.rbacController.getRolesList();
    const roles =
      (result as any)?.data?.assignable_roles ??
      (result as any)?.assignable_roles ??
      null;
    if (!roles) return { success: false, message: "Impossible de récupérer les rôles.", data: null };
    return { success: true, message: "Rôles récupérés avec succès.", data: roles };
  } catch (e) {
    return { success: false, message: String(e), data: null };
  }
}

export async function handleGetPermissionsListAction(): Promise<AppActionResult<ApiPermission[] | null>> {
  try {
    const result = await featuresDi.rbacController.getPermissionsList();
    const raw =
      (result as any)?.data?.permissions ??
      (result as any)?.permissions ??
      (Array.isArray(result) ? result : null);
    if (!Array.isArray(raw)) return { success: false, message: "Impossible de récupérer les permissions.", data: null };
    return { success: true, message: "Permissions récupérées.", data: raw as ApiPermission[] };
  } catch (e) {
    return { success: false, message: String(e), data: null };
  }
}
