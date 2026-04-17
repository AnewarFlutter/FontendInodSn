import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// TODO: remplacer par l'entity du nouveau module user
export type UserEntity = Record<string, unknown>

export type UserState = {
    user: UserEntity | null
}

export type UserActions = {
    setUser: (user: UserEntity) => void
    setUserAction: (user: UserEntity) => void
}

export type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: UserEntity) => set({ user }),
            setUserAction: (user: UserEntity) => set({ user })
        }),
        {
            name: 'current-user',
        }
    )
)
