export const COPYRIGHT_TEXT = "© 2024 Metal. Tous droits réservés."

export const copyrightFooterLink = {
  text: COPYRIGHT_TEXT,
  linkText: "",
  href: "",
}

export function Copyright() {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {COPYRIGHT_TEXT}
    </p>
  )
}
