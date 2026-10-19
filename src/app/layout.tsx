import type { Metadata, Viewport } from "next";
import { Syne, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PauseOnHide } from "@/components/motion/pause-on-hide";
import { META } from "@/content/site";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-syne",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// The AM mark as a signal line: one peak for the A (with its crossbar), two for the M.
const FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#070d16"/><path d="M4 23 L9 9 L14 23 L19 9 L24 23 L29 9" fill="none" stroke="#8fd3ff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.4 17.5 L11.6 17.5" stroke="#ffb454" stroke-width="2.2" stroke-linecap="round"/></svg>`
  );

const SITE_URL = "https://aminatmoldalieva.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: META.title,
  description: META.description,
  openGraph: {
    title: META.title,
    description: META.description,
    type: "website",
    url: SITE_URL,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  icons: { icon: FAVICON },
};

export const viewport: Viewport = {
  themeColor: "#070d16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the inline script adds `film-js` to this element before React hydrates.
    <html lang="en" className={`${syne.variable} ${instrument.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Before first paint: `js` marks that scripts run (without it the header scrolls away instead
            of riding over the page as a bar that never turns solid). Captions are visible by default and
            only fade under JavaScript, and only when motion is allowed (reduced motion keeps the still
            layout, as with JavaScript off). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js"); matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.add("film-js")`,
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="env" aria-hidden="true" />
        <PauseOnHide />
        {children}
      </body>
    </html>
  );
}
