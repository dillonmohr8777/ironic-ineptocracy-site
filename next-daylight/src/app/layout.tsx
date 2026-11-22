import type { Metadata } from "next";
import {
  Instrument_Serif,
  Plus_Jakarta_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import { Header, Footer } from "@/components/Chrome";
import "./globals.css";
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--display",
});
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--sans" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--mono",
});
export const metadata: Metadata = {
  title: {
    default: "The Ironic Ineptocracy — The Public Archive",
    template: "%s — The Ironic Ineptocracy",
  },
  description:
    "Enter the public archive of Dillon Mohr’s satirical political thriller. Ten subject files, four cold opens, and one American pressure route.",
  icons: { icon: "/mark.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
