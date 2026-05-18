import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ClerkProvider, Show, SignInButton, SignUpButton} from "@clerk/nextjs";
import UserMenu from "../components/clerk-user-button";
import { Provider } from "../components/ui/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReadCycle",
  description: "Marketplace de libros usados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <Provider>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <Show when="signed-out">
                <SignInButton />
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserMenu />
              </Show>
            </header>
            {children}
          </Provider>
        </ClerkProvider>
      </body>
    </html>
  );
}