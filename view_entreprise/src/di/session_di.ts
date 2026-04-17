import { SessionController } from "@/adapters/auth/session/session_controller";
import { RestApiSessionDataSourceImpl } from "@/modules/auth/session/data/datasources/rest_api_session_data_source_impl";
import { SessionRepositoryImpl } from "@/modules/auth/session/data/repositories/session_repository_impl";
import { LoginUseCase } from "@/modules/auth/session/domain/usecases/login_use_case";
import { LogoutUseCase } from "@/modules/auth/session/domain/usecases/logout_use_case";
import { RefreshTokenUseCase } from "@/modules/auth/session/domain/usecases/refresh_token_use_case";
import { SwitchContextUseCase } from "@/modules/auth/session/domain/usecases/switch_context_use_case";

/** DI – Session */
const sessionDataSource = new RestApiSessionDataSourceImpl();
const sessionRepo = new SessionRepositoryImpl(sessionDataSource);
const loginUseCase = new LoginUseCase(sessionRepo);
const logoutUseCase = new LogoutUseCase(sessionRepo);
const refreshTokenUseCase = new RefreshTokenUseCase(sessionRepo);
const switchContextUseCase = new SwitchContextUseCase(sessionRepo);
const sessionController = new SessionController(
    loginUseCase,
    logoutUseCase,
    refreshTokenUseCase,
    switchContextUseCase
);

export { sessionController };
