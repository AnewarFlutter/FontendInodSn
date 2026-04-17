import { RbacController } from "@/adapters/user/rbac/rbac_controller";
import { RestApiRbacDataSourceImpl } from "@/modules/user/rbac/data/datasources/rest_api_rbac_data_source_impl";
import { RbacRepositoryImpl } from "@/modules/user/rbac/data/repositories/rbac_repository_impl";
import { GetPermissionsListUseCase } from "@/modules/user/rbac/domain/usecases/get_permissions_list_use_case";
import { GetRolesListUseCase } from "@/modules/user/rbac/domain/usecases/get_roles_list_use_case";
import { GetPermissionsCategoriesUseCase } from "@/modules/user/rbac/domain/usecases/get_permissions_categories_use_case";

/** DI – Rbac */
const rbacDataSource = new RestApiRbacDataSourceImpl();
const rbacRepo = new RbacRepositoryImpl(rbacDataSource);
const getPermissionsListUseCase = new GetPermissionsListUseCase(rbacRepo);
const getRolesListUseCase = new GetRolesListUseCase(rbacRepo);
const getPermissionsCategoriesUseCase = new GetPermissionsCategoriesUseCase(rbacRepo);
const rbacController = new RbacController(
    getPermissionsListUseCase,
    getRolesListUseCase,
    getPermissionsCategoriesUseCase
);

export { rbacController };
