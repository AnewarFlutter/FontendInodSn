import { z } from "zod"

const PHONE_REGEX = /^(\+221)?[0-9]{9}$/

export const registerFormSchema = z
  .object({
    lastname: z.string().min(2, "Le nom est requis (min. 2 caractères)"),
    firstname: z.string().min(2, "Le prénom est requis (min. 2 caractères)"),
    cabinet_name: z.string().min(2, "Le nom du cabinet est requis (min. 2 caractères)"),
    email: z.string().email("Adresse email invalide"),
    telephone: z.string().regex(PHONE_REGEX, "Numéro de téléphone invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof registerFormSchema>
