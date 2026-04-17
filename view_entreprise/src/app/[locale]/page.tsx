import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/shared/constants/routes";

export default function LocaleRootPage() {
  redirect(APP_ROUTES.dashboard.root);
}
