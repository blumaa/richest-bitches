import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono, DM_Sans, JetBrains_Mono, Poppins, Lora, Source_Code_Pro, Azeret_Mono } from "next/font/google";
import "./globals.css";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { ThemeStyles } from "./components/ThemeStyles";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

const azeretMono = Azeret_Mono({
  variable: "--font-azeret-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Richest Bitches",
  description: "Who can throw away the most money?",
  openGraph: {
    title: "Richest Bitches",
    description: "Who can throw away the most money?",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} ${dmSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} ${poppins.variable} ${lora.variable} ${sourceCodePro.variable} ${azeretMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-primary pb-[env(safe-area-inset-bottom)]">
        <ThemeStyles />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-surface-raised focus:text-primary focus:px-4 focus:py-2 focus:rounded-xl"
        >
          Skip to content
        </a>
        {children}
        <ThemeSwitcher />
      </body>
    </html>
  );
}
