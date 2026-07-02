import Navbar from './components/navbar';
import './globals.css';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={cn("font-sans antialiased", inter.variable)}>
      <body className="bg-[#0F111A] min-h-screen text-slate-100">
        
        {/* Hapus nav lama dan ganti dengan komponen Navbar di bawah ini */}
        <Navbar />

        {/* Main konten */}
        <main>{children}</main>
        
      </body>
    </html>
  );
}