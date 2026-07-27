import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aminat Moldalieva — Software Engineer",
  description:
    "Software engineer, 5 years in React Native and TypeScript. I build mobile apps, and the automation around them.",
  openGraph: {
    title: "Aminat Moldalieva — Software Engineer",
    description:
      "I build mobile apps, and the automation around them. Currently rebuilding a fintech app used in 100+ countries.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><text y=%2214%22 font-size=%2216%22>🍉</text></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
