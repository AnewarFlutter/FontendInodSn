import { myProfileController } from "./my_profile_di";
import { rbacController } from "./rbac_di";
import { sessionController } from "./session_di";
import { statsController } from "./stats_di";
import { userManagementController } from "./user_management_di";

// Dependency Injection (DI) setup for the all features

export const featuresDi = {
    sessionController,
    myProfileController,
    userManagementController,
    rbacController,
    statsController,
}
