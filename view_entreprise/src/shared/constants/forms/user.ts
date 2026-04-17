import { z } from "zod";
import { UserRoleCodeEnum } from "@/modules/user/enums/user_role_code_enum";

// ─── Création d'utilisateur ────────────────────────────────────────────────────

export const createUserFormSchema = () =>
    z.object({
        first_name: z.string().min(1, "Le prénom est requis."),
        last_name: z.string().min(1, "Le nom est requis."),
        email: z.string().email("Email invalide.").optional().or(z.literal("")),
        phone: z.string().optional().or(z.literal("")),
        gender: z.enum(["M", "F"]),
        birth_date: z.string().optional().or(z.literal("")),
        nationality: z.string().optional().or(z.literal("")),
        roles: z.array(z.nativeEnum(UserRoleCodeEnum)).optional(),
    });

// ─── Mise à jour d'utilisateur ────────────────────────────────────────────────

export const updateUserFormSchema = () =>
    z.object({
        first_name: z.string().min(1, "Le prénom est requis.").optional(),
        last_name: z.string().min(1, "Le nom est requis.").optional(),
        telephone: z.string().optional().or(z.literal("")),
        birth_date: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        gender: z.string().optional().nullable(),
        nationality: z.string().optional().nullable(),
    });

// ─── Mise à jour email / téléphone ────────────────────────────────────────────

export const updateUserEmailFormSchema = () =>
    z.object({
        email: z.string().email("Email invalide."),
    });

export const updateUserPhoneFormSchema = () =>
    z.object({
        phone: z.string().min(1, "Le numéro de téléphone est requis."),
    });

// ─── Profils métier ────────────────────────────────────────────────────────────

export const updateCuisinierProfileFormSchema = () =>
    z.object({
        specialites: z.string().optional(),
        poste_principal: z.string().optional(),
        allergenes_maitrises: z.string().optional(),
    });

export const updateServeurProfileFormSchema = () =>
    z.object({
        sections_assignees: z.string().optional(),
        tables_assignees: z.string().optional(),
        langues_parlees: z.string().optional(),
    });

export const updateCaissierProfileFormSchema = () =>
    z.object({
        pos_terminal_id: z.string().optional(),
        assigned_cash_register: z.string().optional(),
    });

export const updateManagerProfileFormSchema = () =>
    z.object({
        notes: z.string().optional(),
        responsabilites: z.string().optional(),
    });

// ─── Rôles & Permissions ───────────────────────────────────────────────────────

export const assignRolesFormSchema = () =>
    z.object({
        role: z.nativeEnum(UserRoleCodeEnum),
    });

export const userPermissionsFormSchema = () =>
    z.object({
        permission: z.string().min(1, "La permission est requise."),
    });
