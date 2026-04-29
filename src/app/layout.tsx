import type { Metadata, Viewport } from "next"; // <-- Importamos Viewport
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. CONFIGURACIÓN DEL VIEWPORT (Vital para móviles)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Evita que se mueva todo al escribir en inputs
}

export const metadata: Metadata = {
  title: "SITEC - TecNM Celaya",
  description: "Sistema de Atención Integral Estudiantil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es" // Cambiado a español
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-slate-50 text-slate-900 selection:bg-blue-100">
        {/* Aseguramos que el body ocupe toda la pantalla 
            y no tenga comportamientos de rebote raros en iOS 
        */}
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}