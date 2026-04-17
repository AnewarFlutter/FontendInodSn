import { GenderEnum } from "@/modules/user/enums/gender_enum";
import { UserRoleCodeEnum } from "@/modules/user/enums/user_role_code_enum";
import { UserBasic } from "@/modules/user/types/user_basic_types";
import { UserDetail } from "@/modules/user/types/user_detail_types";
import { PaginatedUsers } from "@/modules/user/types/paginated_users_types";

export const MockUsers: UserDetail[] = [
    {
        id: "usr-001",
        auth_user_id: "auth-001",
        email: "admin@restaurant.com",
        first_name: "Alice",
        last_name: "Martin",
        telephone: "+33612345678",
        gender: GenderEnum.F,
        birth_date: "1990-04-15",
        address: "12 rue de la Paix, Paris",
        avatar: null,
        is_active: true,
        roles: [{ code: UserRoleCodeEnum.ADMIN }],
        created_at: "2024-01-10T08:00:00Z",
    },
    {
        id: "usr-002",
        auth_user_id: "auth-002",
        email: "manager@restaurant.com",
        first_name: "Bruno",
        last_name: "Dupont",
        telephone: "+33698765432",
        gender: GenderEnum.M,
        birth_date: "1985-09-22",
        address: "5 avenue Victor Hugo, Lyon",
        avatar: null,
        is_active: true,
        roles: [{ code: UserRoleCodeEnum.MANAGER }],
        created_at: "2024-02-05T09:30:00Z",
    },
    {
        id: "usr-003",
        auth_user_id: "auth-003",
        email: "cuisinier@restaurant.com",
        first_name: "Chloé",
        last_name: "Bernard",
        telephone: null,
        gender: GenderEnum.F,
        birth_date: "1993-07-08",
        address: null,
        avatar: null,
        is_active: true,
        roles: [{ code: UserRoleCodeEnum.CUISINIER }],
        created_at: "2024-03-12T11:00:00Z",
    },
    {
        id: "usr-004",
        auth_user_id: "auth-004",
        email: "serveur@restaurant.com",
        first_name: "David",
        last_name: "Leclerc",
        telephone: "+33677889900",
        gender: GenderEnum.M,
        birth_date: "1997-12-01",
        address: null,
        avatar: null,
        is_active: false,
        roles: [{ code: UserRoleCodeEnum.SERVEUR }],
        created_at: "2024-04-20T14:00:00Z",
    },
];

export const MockPaginatedUsers: PaginatedUsers = {
    count: MockUsers.length,
    next: null,
    previous: null,
    results: MockUsers as unknown as UserBasic[],
};
