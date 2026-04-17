import { MyProfileController } from "@/adapters/user/my_profile/my_profile_controller";
import { RestApiMyProfileDataSourceImpl } from "@/modules/user/my_profile/data/datasources/rest_api_my_profile_data_source_impl";
import { MyProfileRepositoryImpl } from "@/modules/user/my_profile/data/repositories/my_profile_repository_impl";
import { GetMyProfileUseCase } from "@/modules/user/my_profile/domain/usecases/get_my_profile_use_case";
import { UpdateMyProfileUseCase } from "@/modules/user/my_profile/domain/usecases/update_my_profile_use_case";
import { GetMyRolesUseCase } from "@/modules/user/my_profile/domain/usecases/get_my_roles_use_case";
import { GetMyPermissionsUseCase } from "@/modules/user/my_profile/domain/usecases/get_my_permissions_use_case";
import { UploadMyAvatarUseCase } from "@/modules/user/my_profile/domain/usecases/upload_my_avatar_use_case";
import { UpdateMyPhoneUseCase } from "@/modules/user/my_profile/domain/usecases/update_my_phone_use_case";
import { ChangePasswordUseCase } from "@/modules/user/my_profile/domain/usecases/change_password_use_case";

/** DI – MyProfile */
const myProfileDataSource = new RestApiMyProfileDataSourceImpl();
const myProfileRepo = new MyProfileRepositoryImpl(myProfileDataSource);
const getMyProfileUseCase = new GetMyProfileUseCase(myProfileRepo);
const updateMyProfileUseCase = new UpdateMyProfileUseCase(myProfileRepo);
const getMyRolesUseCase = new GetMyRolesUseCase(myProfileRepo);
const getMyPermissionsUseCase = new GetMyPermissionsUseCase(myProfileRepo);
const uploadMyAvatarUseCase = new UploadMyAvatarUseCase(myProfileRepo);
const updateMyPhoneUseCase = new UpdateMyPhoneUseCase(myProfileRepo);
const changePasswordUseCase = new ChangePasswordUseCase(myProfileRepo);
const myProfileController = new MyProfileController(
    getMyProfileUseCase,
    updateMyProfileUseCase,
    getMyRolesUseCase,
    getMyPermissionsUseCase,
    uploadMyAvatarUseCase,
    updateMyPhoneUseCase,
    changePasswordUseCase
);

export { myProfileController };
