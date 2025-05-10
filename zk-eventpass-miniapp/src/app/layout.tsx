// src/app/layout.tsx

import "./globals.css";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { auth } from "@/auth";
import ClientProviders from "@/providers";

// ← Import the provider
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ZK EventPass Mini App",
  description: "Your POD + World ID + Wallet powered mini-app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable}`}>
        {/* ← Wrap everything in MiniKitProvider */}
        <MiniKitProvider>
          <ClientProviders session={session}>{children}</ClientProviders>
        </MiniKitProvider>
      </body>
    </html>
  );
}
