import type { Metadata } from "next";
import { Anton, Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Copa del Mundo 2026 · Simulador Editorial",
  description: "Simulador del Mundial 2026: 48 selecciones, 12 grupos, 104 partidos.",
};

const THEME_INIT = `
(function(){
  try {
    var valid = ['editorial','dark','panini-classic','panini-premium'];
    var t = localStorage.getItem('wc26-theme');
    if (!t || valid.indexOf(t) === -1) {
      var legacy = localStorage.getItem('wc26-dark');
      t = legacy === 'true' ? 'dark' : 'editorial';
    }
    document.documentElement.setAttribute('data-theme', t);
    var l = localStorage.getItem('wc26-lang');
    if (l === 'es' || l === 'pt') document.documentElement.lang = l;
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-theme="editorial"
      suppressHydrationWarning
      className={`${anton.variable} ${playfair.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
