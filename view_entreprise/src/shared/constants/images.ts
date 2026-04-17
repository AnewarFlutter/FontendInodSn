/**
 * Images constants of the application.
 *
 * This constant contains all the image paths used in the application.
 * It centralizes image management for better maintainability.
 *
 * @constant
 * @type {Object}
 */
export const APP_IMAGES = {
    // Logo
    logo: {
        main: "/images_logo_site/_1.png",
    },

    // Modules marketplace logos
    modules: {
        actes:        "/images_modules/actes.png",
        dossiers:     "/images_modules/dossiers.png",
        agenda:       "/images_modules/agenda.png",
        comptabilite: "/images_modules/comptabilite.png",
        signature:    "/images_modules/signature.png",
        archivage:    "/images_modules/archivage.png",
    },

    // Avatar images
    avatar: {
        avatar1: "/image_avatar/_1.png",
        avatar2: "/image_avatar/_2.png",
        avatar3: "/image_avatar/_3.png",
        avatar4: "/image_avatar/_4.png",
    },


    // Dropdown menu images
    drownMenu: {
        image1: "/images_drown_menu/_1.png",
    },

    // Auth pages backgrounds (utilise les images du carousel)
    auth: {
        loginBackground: "/images_serveur_auth/_2.jpg",
        registerBackground: "/images_serveur_auth/_3.jpg",
        forgotPasswordBackground: "/images_serveur_auth/_1.jpg",
        resetPasswordBackground: "/images_serveur_auth/_2.jpg",
        otpBackground: "/images_serveur_auth/_3.jpg",
    },



 
 
} as const;

/**
 * Type helper pour obtenir tous les chemins d'images de l'application
 */
export type AppImagesType = typeof APP_IMAGES;
