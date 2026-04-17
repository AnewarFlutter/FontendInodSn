/**
 * Routes of the application.
 */
export const APP_ROUTES = {
    home: {
        root: "/dashboard/global-statistics",
    },

    auth: {
        login: "/auth/login",
        logout: "/auth/login",
        register: "/auth/register",
        forgotPassword: "/auth/forgot-password",
        resetPassword: "/auth/reset-password",
        otp: "/auth/otp",
    },

    dashboard: {
        root: "/dashboard/global-statistics",
        main: "/dashboard/global-statistics",
        globalStatistics: "/dashboard/global-statistics",
    },

    userManagement: {
        root: "/user-management",
    },

    settings: {
        root: "/settings",
    },

    modules: {
        root: "/modules/shop",
        shop: "/modules/shop",
        historique: "/modules/historique",
    },

    dossiers: {
        root: "/dossiers",
    },

    recherche: {
        root: "/recherche",
    },

    archives: {
        root: "/archives",
    },

} as const;

/**
 * Type helper pour obtenir toutes les routes de l'application
 */
export type AppRoutesType = typeof APP_ROUTES;