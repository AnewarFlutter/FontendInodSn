# 🎨 Système de Styles - Architecture Détaillée

## Point de départ global CSS
Le CSS global est chargé dans le **root layout**:

**[src/app/layout.tsx](src/app/layout.tsx#L4)**
```typescript
import "./globals.css";
```

Ce fichier est importé une seule fois au niveau racine et s'applique à toute l'application.

---

## Ce que contient `src/styles`

Le dossier `src/styles` expose 4 polices via **Next.js Font Optimization**:

### Geist Sans
**[fonts.ts:4](src/styles/fonts.ts#L4)**
```typescript
export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
```
Expose la variable CSS: `--font-geist-sans`

### Geist Mono  
**[fonts.ts:9](src/styles/fonts.ts#L9)**
```typescript
export const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
```
Expose la variable CSS: `--font-geist-mono`

### Kablammo
**[fonts.ts:14](src/styles/fonts.ts#L14)**
```typescript
export const kablammo = Kablammo({
    variable: "--font-kablammo",
    subsets: ["latin"],
});
```
Expose la variable CSS: `--font-kablammo`

### Font locale mono.woff2
**[fonts.ts:19](src/styles/fonts.ts#L19)**
```typescript
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
```
Expose la variable CSS: `--font-local-geist-mono`

---

## Comment ces polices sont injectées dans le DOM

Le root layout met toutes les variables de polices sur le **body**:

**[src/app/layout.tsx:16](src/app/layout.tsx#L16)**
```typescript
<body
  className={`${geistSans.variable} ${geistMono.variable} ${kablammo.variable} ${localGeistMono.variable} antialiased overflow-x-hidden`}
>
```

Résultat HTML:
```html
<body class="font-[--font-geist-sans] font-[--font-geist-mono] font-[--font-kablammo] font-[--font-local-geist-mono] antialiased overflow-x-hidden" style="--font-geist-sans: ...; --font-geist-mono: ...; --font-kablammo: ...; --font-local-geist-mono: ...;">
```

---

## Comment Tailwind les utilise

Dans **[src/app/globals.css](src/app/globals.css)**, Tailwind v4 mappe les variables aux tokens:

**[globals.css:6](src/app/globals.css#L6)**
```css
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-local-geist-mono);
  ...
}
```

Cela signifie:
- `font-sans` utilise `--font-geist-sans` (importé de Next.js)
- `font-mono` utilise `--font-local-geist-mono` (police locale customisée)

Toutes les classes Tailwind de typo héritent automatiquement:
```html
<p class="font-sans">Utilise Geist Sans</p>
<code class="font-mono">Utilise mono local</code>
```

---

## Thème clair/sombre et tokens

Le fichier **globals.css** définit deux ensembles de variables CSS:

### Variables light (`:root`)
**[globals.css:46](src/app/globals.css#L46)**
```css
:root {
  --radius: 0.625rem;
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.13 0.028 261.692);
  --primary: oklch(0.21 0.034 264.665);
  --background: oklch(1 0 0);
  --foreground: oklch(0.13 0.028 261.692);
  /* + variables charts, sidebar, etc. */
}
```

### Variables dark (`.dark`)
**[globals.css:103](src/app/globals.css#L103)**
```css
.dark {
  --background: oklch(0.13 0.028 261.692);
  --foreground: oklch(0.985 0.002 247.839);
  --primary: oklch(0.928 0.006 264.531);
  --card: oklch(0.21 0.034 264.665);
  /* inversion des couleurs pour dark mode */
}
```

### Application au body
**[globals.css:142](src/app/globals.css#L142)**
```css
body {
  background: var(--background);
  color: var(--foreground);
}
```

Le switch thème est piloté par le **ThemeProvider**:

**[src/app/layout.tsx:23](src/app/layout.tsx#L23)**
```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="light"
  enableSystem={false}
  disableTransitionOnChange
>
```

Quand l'utilisateur change le thème, le ThemeProvider ajoute/retire la classe `.dark` sur le `<html>`, ce qui active le sélecteur `.dark { ... }` dans le CSS.

---

## Pipeline de compilation CSS

```
postcss.config.mjs
    ↓
Plugin: @tailwindcss/postcss (Tailwind v4)
    ↓
src/app/globals.css
    ├─ @import "tailwindcss"
    ├─ @theme inline { ... }  ← Token mapping
    ├─ :root { ... }          ← Variables light
    └─ .dark { ... }          ← Variables dark
    ↓
Autres fichiers CSS importés
    ├─ @import "tw-animate-css"
    └─ @custom-variant dark
    ↓
Sortie CSS compilée et injectée dans le DOM
```

**Configuration PostCSS:**  
**[postcss.config.mjs](postcss.config.mjs)**
```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};
```

---

## Architecture du i18n

Le layout locale gère l'**internationalization** (FR/EN):

**[src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx)**
```typescript
<NextIntlClientProvider locale={locale} messages={messages}>
  {children}
</NextIntlClientProvider>
```

Cela enveloppe tous les enfants du slug `[locale]` pour que les messages soient disponibles dans les composants.

---

## 📋 Résumé court

1. **src/styles/fonts.ts** → Déclare 4 polices (Geist Sans/Mono, Kablammo, mono local)
2. **src/app/layout.tsx** → Importe les fonts et globals.css, injecte variables sur le body
3. **src/app/globals.css** → 
   - Importe Tailwind v4
   - Mappe variables CSS aux tokens Tailwind
   - Définit variables de couleurs pour light (`:root`) et dark (`.dark`)
4. **postcss.config.mjs** → Pipeline: @tailwindcss/postcss compile tout
5. **src/app/[locale]/layout.tsx** → Wrapper NextIntlClientProvider pour i18n

**Flux de propagation:**
```
fonts.ts variables 
    ↓
layout.tsx (injected on body)
    ↓
globals.css (Tailwind mapping)
    ↓
Tous les composants héritent via Tailwind
```

Grâce à ce setup, n'importe quel composant peut utiliser:
- `font-sans`, `font-mono` (typo)
- `bg-background`, `text-foreground` (couleurs)
- `bg-primary`, `text-primary-foreground` (branding)
- Tous les tokens Tailwind pour cards, sidebars, charts, etc.
