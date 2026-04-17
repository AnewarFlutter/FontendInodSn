'use client';

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="max-w-(--breakpoint-xl) mx-auto">
        <div className="py-6 flex items-center justify-center px-6 xl:px-0">
          <span className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Metal. Tous droits réservés.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
