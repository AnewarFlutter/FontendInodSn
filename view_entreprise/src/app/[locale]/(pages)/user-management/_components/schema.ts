import { z } from "zod"

// Schéma pour une permission
export const permissionSchema = z.object({
  id: z.number(),
  code: z.string(),
  nom: z.string(),
  description: z.string().optional(),
  module: z.string(), // ex: "inventory", "orders", "users", "dashboard"
})

export type Permission = z.infer<typeof permissionSchema>

// Schéma pour un rôle
export const roleSchema = z.object({
  id: z.number(),
  nom: z.string(),
  description: z.string().optional(),
  couleur: z.string().default("#6366f1"), // couleur pour badge
  permissionIds: z.array(z.number()),
  createdAt: z.string(),
})

export type Role = z.infer<typeof roleSchema>

// Schéma pour un utilisateur
export const userSchema = z.object({
  id: z.number(),
  apiId: z.string().optional(),
  nom: z.string(),
  prenom: z.string(),
  email: z.string().email(),
  telephone: z.string().optional(),
  nationalite: z.string().optional(),
  avatar: z.string().optional(),
  roleId: z.number(),
  roleName: z.string(),
  roleNames: z.array(z.string()).default([]),
  statut: z.enum(["Actif", "Inactif", "Suspendu"]),
  permissionsSupplementaires: z.array(z.number()).default([]), // permissions additionnelles au rôle
  permissionsRetirees: z.array(z.number()).default([]), // permissions retirées du rôle
  createdAt: z.string(),
  lastLogin: z.string().optional(),
})

export type User = z.infer<typeof userSchema>
