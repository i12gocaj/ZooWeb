// app/layout.js

import localFont from "next/font/local";
import "./globals.css";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Map, Leaf } from 'lucide-react'; // Importa el ícono Map
import Chatbot from '@/components/chatbot'; // Asegúrate de que la ruta sea correcta

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Natural Zoo",
  description: "Discover the wonder of wildlife in a safe and educational environment.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-stone-100`}>
      <body className="antialiased text-primary-dark">
        {/* Shared Header */}
        <header className="bg-green-900 text-white p-4 border-b-4 border-primary">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo and Title */}
            <Link href="/" className="text-2xl font-bold hover:underline flex items-center">
              Natural Zoo
              <Leaf className="ml-2 h-6 w-6" /> {/* Ícono de hoja añadido */}
            </Link>
            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <Link href="/zoo-home">
                <Button
                  variant="ghost"
                  className="text-white hover:text-green-200 focus:text-green-200 active:text-green-200 hover:bg-transparent focus:bg-transparent active:bg-transparent hover:border hover:border-white"
                >
                  Explore Zoo
                </Button>
              </Link>
              <Link href="/tour-reservation">
                <Button variant="outline" className="bg-white text-green-900 hover:bg-green-100 border-green-900 flex items-center">
                  Reserve Tour & Book Tickets
                  <Map className="ml-2 h-4 w-4" /> {/* Ícono adicional */}
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        {children}

        {/* Chatbot */}
        <Chatbot />

        {/* Shared Footer */}
        <footer className="bg-green-900 text-white p-4 border-t-4 border-primary mt-8">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 Natural Zoo. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="text-white hover:text-green-200">
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-white hover:text-green-200">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

