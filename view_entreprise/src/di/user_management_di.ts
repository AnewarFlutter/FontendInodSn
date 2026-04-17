import { UserManagementController } from "@/adapters/user/user_management/user_management_controller";
import { RestApiUserManagementDataSourceImpl } from "@/modules/user/user_management/data/datasources/rest_api_user_management_data_source_impl";
import { UserManagementRepositoryImpl } from "@/modules/user/user_management/data/repositories/user_management_repository_impl";
import { GetUsersListUseCase } from "@/modules/user/user_management/domain/usecases/get_users_list_use_case";
import { CreateUserUseCase } from "@/modules/user/user_management/domain/usecases/create_user_use_case";
import { GetUserDetailUseCase } from "@/modules/user/user_management/domain/usecases/get_user_detail_use_case";
import { UpdateUserUseCase } from "@/modules/user/user_management/domain/usecases/update_user_use_case";
import { UpdateUserEmailUseCase } from "@/modules/user/user_management/domain/usecases/update_user_email_use_case";
import { UpdateUserPhoneUseCase } from "@/modules/user/user_management/domain/usecases/update_user_phone_use_case";
import { SuspendUserUseCase } from "@/modules/user/user_management/domain/usecases/suspend_user_use_case";
import { ActivateUserUseCase } from "@/modules/user/user_management/domain/usecases/activate_user_use_case";
import { SoftDeleteUserUseCase } from "@/modules/user/user_management/domain/usecases/soft_delete_user_use_case";
import { RestoreUserUseCase } from "@/modules/user/user_management/domain/usecases/restore_user_use_case";
import { UpdateUserCuisinierProfileUseCase } from "@/modules/user/user_management/domain/usecases/update_user_cuisinier_profile_use_case";
import { UpdateUserServeurProfileUseCase } from "@/modules/user/user_management/domain/usecases/update_user_serveur_profile_use_case";
import { UpdateUserCaissierProfileUseCase } from "@/modules/user/user_management/domain/usecases/update_user_caissier_profile_use_case";
import { UpdateUserLivreurProfileUseCase } from "@/modules/user/user_management/domain/usecases/update_user_livreur_profile_use_case";
import { ActivateUserLivreurProfileUseCase } from "@/modules/user/user_management/domain/usecases/activate_user_livreur_profile_use_case";
import { UpdateUserManagerProfileUseCase } from "@/modules/user/user_management/domain/usecases/update_user_manager_profile_use_case";
import { AssignUserRolesUseCase } from "@/modules/user/user_management/domain/usecases/assign_user_roles_use_case";
import { RevokeUserRolesUseCase } from "@/modules/user/user_management/domain/usecases/revoke_user_roles_use_case";
import { GrantUserPermissionsUseCase } from "@/modules/user/user_management/domain/usecases/grant_user_permissions_use_case";
import { RevokeUserPermissionsUseCase } from "@/modules/user/user_management/domain/usecases/revoke_user_permissions_use_case";

/** DI – UserManagement */
const userManagementDataSource = new RestApiUserManagementDataSourceImpl();
const userManagementRepo = new UserManagementRepositoryImpl(userManagementDataSource);
const getUsersListUseCase = new GetUsersListUseCase(userManagementRepo);
const createUserUseCase = new CreateUserUseCase(userManagementRepo);
const getUserDetailUseCase = new GetUserDetailUseCase(userManagementRepo);
const updateUserUseCase = new UpdateUserUseCase(userManagementRepo);
const updateUserEmailUseCase = new UpdateUserEmailUseCase(userManagementRepo);
const updateUserPhoneUseCase = new UpdateUserPhoneUseCase(userManagementRepo);
const suspendUserUseCase = new SuspendUserUseCase(userManagementRepo);
const activateUserUseCase = new ActivateUserUseCase(userManagementRepo);
const softDeleteUserUseCase = new SoftDeleteUserUseCase(userManagementRepo);
const restoreUserUseCase = new RestoreUserUseCase(userManagementRepo);
const updateUserCuisinierProfileUseCase = new UpdateUserCuisinierProfileUseCase(userManagementRepo);
const updateUserServeurProfileUseCase = new UpdateUserServeurProfileUseCase(userManagementRepo);
const updateUserCaissierProfileUseCase = new UpdateUserCaissierProfileUseCase(userManagementRepo);
const updateUserLivreurProfileUseCase = new UpdateUserLivreurProfileUseCase(userManagementRepo);
const activateUserLivreurProfileUseCase = new ActivateUserLivreurProfileUseCase(userManagementRepo);
const updateUserManagerProfileUseCase = new UpdateUserManagerProfileUseCase(userManagementRepo);
const assignUserRolesUseCase = new AssignUserRolesUseCase(userManagementRepo);
const revokeUserRolesUseCase = new RevokeUserRolesUseCase(userManagementRepo);
const grantUserPermissionsUseCase = new GrantUserPermissionsUseCase(userManagementRepo);
const revokeUserPermissionsUseCase = new RevokeUserPermissionsUseCase(userManagementRepo);
const userManagementController = new UserManagementController(
    getUsersListUseCase,
    createUserUseCase,
    getUserDetailUseCase,
    updateUserUseCase,
    updateUserEmailUseCase,
    updateUserPhoneUseCase,
    suspendUserUseCase,
    activateUserUseCase,
    softDeleteUserUseCase,
    restoreUserUseCase,
    updateUserCuisinierProfileUseCase,
    updateUserServeurProfileUseCase,
    updateUserCaissierProfileUseCase,
    updateUserLivreurProfileUseCase,
    activateUserLivreurProfileUseCase,
    updateUserManagerProfileUseCase,
    assignUserRolesUseCase,
    revokeUserRolesUseCase,
    grantUserPermissionsUseCase,
    revokeUserPermissionsUseCase
);

export { userManagementController };
