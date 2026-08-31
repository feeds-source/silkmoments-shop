import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { StoreShell } from "@/components/store-shell";
import appCss from "../styles.css?url";

const APP_NAME = "Femme — Silk Moments";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#0c0a0b" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "description", content: "Femme by Silk Moments — jewel-tone silk lingerie, lace babydolls, teddies, bridal robes, and lounge. Cash on delivery worldwide with discreet packaging." },
      { name: "keywords", content: "silk lingerie, jewel tone lingerie, silk babydoll, lace teddy, silk nightgown, bridal lingerie, silk robe, wireless bra, t-shirt bra, lace bralette, cash on delivery lingerie, Femme Silk Moments, exotic silk" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500;1,600&family=Outfit:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg antialiased">
        <PreviewHostBridge />
        <AuthProvider>
          <StoreShell>
            <Outlet />
          </StoreShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
