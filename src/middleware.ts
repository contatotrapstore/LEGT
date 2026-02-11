import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { detectLocaleFromHeader, localeToDefaultRegion } from "@/i18n/config";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Auto-detect locale and region on first visit (no cookie yet)
  if (!request.cookies.get("NEXT_LOCALE")) {
    const acceptLang = request.headers.get("accept-language") || "";
    const locale = detectLocaleFromHeader(acceptLang);
    const region = localeToDefaultRegion[locale];

    response.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 31536000 });
    response.cookies.set("PREFERRED_REGION", region, { path: "/", maxAge: 31536000 });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
