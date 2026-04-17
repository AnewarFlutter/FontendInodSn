"use server";

import { featuresDi } from "@/di/features_di";
import { AppActionResult } from "@/shared/types/global";

export type ApiUserStats = {
  total_users: number
  active_users: number
  suspended_users: number
  deleted_users: number
  by_role: Record<string, number>
}

export async function handleGetUserStatsAction(): Promise<AppActionResult<ApiUserStats | null>> {
  try {
    const result = await featuresDi.statsController.getUserStats();
    const stats = (result as any)?.data ?? result ?? null;
    if (!stats) return { success: false, message: "Impossible de récupérer les statistiques.", data: null };
    return { success: true, message: "Statistiques récupérées avec succès.", data: stats };
  } catch (e) {
    return { success: false, message: String(e), data: null };
  }
}
