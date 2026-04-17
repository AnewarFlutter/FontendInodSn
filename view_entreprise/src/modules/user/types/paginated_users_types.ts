import { UserBasic } from "@/modules/user/types/user_basic_types";

/**

/**
 * PaginatedUsers
 * 
 * Type personnalisé
 */
export type PaginatedUsers = {

count: number;

next?: string | null;

previous?: string | null;

results: UserBasic[];
};
