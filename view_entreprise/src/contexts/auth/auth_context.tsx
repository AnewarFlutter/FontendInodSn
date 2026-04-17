'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginContextEnum } from '@/modules/auth/enums/login_context_enum';
import { LoginUserWrapper } from '@/modules/auth/types/login_user_wrapper_types';
import { usePathname } from 'next/navigation';

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Détecte si un objet parsé est un LoginUserWrapper (stocké par SessionCookies.set(session.user))
 * plutôt qu'un AuthSessionData complet.
 * Le cookie user_session stocke directement LoginUserWrapper, pas AuthSessionData.
 */
function parseUserSessionCookie(raw: string): AuthSessionData | null {
    const parsed = JSON.parse(raw);

    // Si l'objet a une propriété "user" → c'est déjà un AuthSessionData complet
    if (parsed && typeof parsed === 'object' && 'user' in parsed) {
        return parsed as AuthSessionData;
    }

    // Sinon c'est un LoginUserWrapper stocké directement (cas actuel via SessionCookies.set)
    if (parsed && typeof parsed === 'object' && 'data' in parsed) {
        return {
            user: parsed as LoginUserWrapper,
            context: LoginContextEnum.ADMIN, // contexte par défaut (non stocké dans le cookie)
        };
    }

    return null;
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface AuthSessionData {
    user: LoginUserWrapper;
    context: LoginContextEnum;
}

interface AuthContextType {
    session: AuthSessionData | null;
    isAuthenticated: boolean;
    setSession: (data: AuthSessionData) => void;
    clearSession: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSessionState] = useState<AuthSessionData | null>(null);
    const pathname = usePathname();

    // Recharge la session à chaque navigation (ex: login -> dashboard)
    // pour éviter un état session=null persistant après connexion.
    useEffect(() => {
        try {
            const match = document.cookie
                .split('; ')
                .find((row) => row.startsWith('user_session='));

            if (match) {
                const raw = decodeURIComponent(match.split('=')[1]);
                // Utilise le helper pour gérer les deux formats possibles du cookie
                const parsed = parseUserSessionCookie(raw);
                if (parsed) setSessionState(parsed);
            } else {
                setSessionState(null);
            }
        } catch {
            // Cookie absent ou malformé — session reste null
            setSessionState(null);
        }
    }, [pathname]);

    const setSession = (data: AuthSessionData) => {
        setSessionState(data);
    };

    const clearSession = () => {
        setSessionState(null);
    };

    return (
        <AuthContext.Provider value={{
            session,
            isAuthenticated: session !== null,
            setSession,
            clearSession,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext doit être utilisé à l\'intérieur d\'un <AuthProvider>.');
    }
    return context;
}
