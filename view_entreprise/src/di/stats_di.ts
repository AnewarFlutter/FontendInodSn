import { StatsController } from "@/adapters/user/stats/stats_controller";
import { RestApiStatsDataSourceImpl } from "@/modules/user/stats/data/datasources/rest_api_stats_data_source_impl";
import { StatsRepositoryImpl } from "@/modules/user/stats/data/repositories/stats_repository_impl";
import { GetUserStatsUseCase } from "@/modules/user/stats/domain/usecases/get_user_stats_use_case";

/** DI – Stats */
const statsDataSource = new RestApiStatsDataSourceImpl();
const statsRepo = new StatsRepositoryImpl(statsDataSource);
const getUserStatsUseCase = new GetUserStatsUseCase(statsRepo);
const statsController = new StatsController(
    getUserStatsUseCase
);

export { statsController };
