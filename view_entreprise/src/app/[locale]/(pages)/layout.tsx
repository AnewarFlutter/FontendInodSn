import { PagesLayoutUI } from "./_components/pages-layout-ui";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PagesLayoutUI>{children}</PagesLayoutUI>;
}
