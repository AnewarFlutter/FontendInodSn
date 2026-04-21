import { Geist, Geist_Mono, Kablammo } from "next/font/google";
import localFont from 'next/font/local';

export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const kablammo = Kablammo({
    variable: "--font-kablammo",
    subsets: ["latin"],
});

export const localGeistMono = localFont({
    src: [
        {
            path: './fonts/mono.woff2',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-local-geist-mono',
    display: 'swap',
})