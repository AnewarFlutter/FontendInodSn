import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '404 – Page introuvable',
    description: 'La page que vous cherchez n\'existe pas.',
}

export default function HomePage() {
    return (
        <main className="grid min-h-screen grid-cols-[1fr_2fr_1fr] grid-rows-[1fr_2fr_1fr] bg-zinc-900 text-white">
            <div className="border-r border-b border-dashed border-white/20" />
            <div className="border-b border-dashed border-white/20" />
            <div className="border-l border-b border-dashed border-white/20" />

            <div className="border-r border-dashed border-white/20" />

            <div className="flex items-center justify-center">
                <div className="text-center px-6">
                    <h1 className="text-6xl font-extrabold tracking-tight md:text-7xl">
                        404
                    </h1>
                    <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
                        Page introuvable
                    </h2>
                    <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">
                        La page que vous cherchez n&apos;existe pas, a été déplacée ou n&apos;est plus disponible.
                    </p>
                    <p className="mt-10 text-xs text-white/40">
                        © {new Date().getFullYear()} Hello Restauration
                    </p>
                </div>
            </div>

            <div className="border-l border-dashed border-white/20" />

            <div className="border-r border-t border-dashed border-white/20" />
            <div className="border-t border-dashed border-white/20" />
            <div className="border-l border-t border-dashed border-white/20" />
        </main>
    )
}
