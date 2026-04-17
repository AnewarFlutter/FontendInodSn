import { toast } from "sonner"

// Types de notifications pour le restaurant
export type NotificationType = 'commande' | 'livraison' | 'cuisine' | 'system'

// Fonction pour afficher une notification (en haut à droite)
export const showNotification = (
  title: string,
  description: string,
  duration: number = 5000
) => {
  toast(title, {
    description,
    duration,
    classNames: {
      description: "!text-foreground/80",
    },
  })
}

// Fonction pour afficher un message de succès (en bas à droite)
export const showSuccess = (
  message: string,
  description?: string,
  duration: number = 3000
) => {
  toast.success(message, {
    description,
    duration,
    classNames: {
      description: "!text-foreground/80",
    },
  })
}

// Fonction pour afficher un message d'erreur (en bas à droite)
export const showError = (
  message: string,
  description?: string,
  duration: number = 4000
) => {
  toast.error(message, {
    description,
    duration,
    classNames: {
      description: "!text-foreground/80",
    },
  })
}

// Fonction pour afficher un message d'information (en bas à droite)
export const showInfo = (
  message: string,
  description?: string,
  duration: number = 3000
) => {
  toast.info(message, {
    description,
    duration,
    classNames: {
      description: "!text-foreground/80",
    },
  })
}

// Fonction pour afficher un message d'avertissement (en bas à droite)
export const showWarning = (
  message: string,
  description?: string,
  duration: number = 4000
) => {
  toast.warning(message, {
    description,
    duration,
    classNames: {
      description: "!text-foreground/80",
    },
  })
}

// Fonction pour afficher un toast de chargement (en bas à droite)
export const showLoading = (
  message: string,
  description?: string
) => {
  return toast.loading(message, {
    description,
    classNames: {
      description: "!text-foreground/80",
    },
  })
}

// Fonction pour afficher un toast personnalisé avec action
export const showActionToast = (
  message: string,
  description: string,
  actionLabel: string,
  onAction: () => void,
  duration: number = Infinity
) => {
  const toastId = toast(message, {
    description,
    duration,
    action: {
      label: actionLabel,
      onClick: onAction,
    },
    classNames: {
      description: "!text-foreground/80",
    },
  })

  return toastId
}

// Fonction pour fermer un toast spécifique
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId)
}

// Fonction pour fermer tous les toasts
export const dismissAllToasts = () => {
  toast.dismiss()
}
