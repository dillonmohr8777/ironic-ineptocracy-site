import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { Analytics } from "@/components/Analytics";
import { edition, origin, homeTitle, summary } from "@/lib/publication";
import "./globals.css";
import "./publication.css";
import "./world.css";
import { beforePaint } from "@/lib/worldMode";
export const metadata: Metadata = {
  metadataBase: new URL(origin), ...edition("/", homeTitle, summary),
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/icon-512.png", sizes: "512x512", type: "image/png" }], apple: "/apple-touch-icon.png" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: beforePaint }} /><link rel="preload" href="/fonts/instrument-normal-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head><body><Header /><main id="main">{children}</main><Footer /><Analytics /></body></html>;
}
