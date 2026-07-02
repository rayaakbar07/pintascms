"use client";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { supabase } from "@/app/supabaseClient";
import { useRouter } from "next/navigation"; // 1. Tambahkan import ini

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter(); // 2. Tambahkan inisialisasi router di sini

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0F111A]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex h-20 items-center px-6 gap-8">
        <Link href="/">
          <img src="/logos/logo pintas.png" alt="Logo" className="h-16 w-auto" />
        </Link>
        
        {user ? (
          <>
            <Link href="/" className="text-sm text-slate-300 hover:text-white transition">Dashboard</Link>
            <Link href="/tambah" className="text-sm text-slate-300 hover:text-white transition">Tambah Konten</Link>
            <Link href="/semua_konten" className="text-sm text-slate-300 hover:text-white transition">Semua Konten</Link>
            <Link href="/laporan" className="text-sm text-slate-300 hover:text-white transition">Daily Report</Link>
          
            {user.email === 'raya@pintas.com' && (
              <Link href="/laporan/semua" className="text-sm text-blue-400 font-bold hover:text-blue-300 transition">
                Log Laporan
              </Link>
            )}
            <Link href="https://drive.google.com/drive/folders/17KJxotosMYS1M5HIPxe80f300QDQQlsU?usp=share_link" className="text-sm text-slate-300 hover:text-white transition">Drive Pintas</Link>

            <button 
              onClick={async () => {
                await supabase.auth.signOut(); 
                router.push("/login");        
                router.refresh();             
              }} 
              className="text-sm text-red-400 hover:text-red-300 transition ml-auto"
            >
              Logout 
            </button>
          </> // 3. Hapus tanda <> yang salah di baris ini
        ) : (
          <Link href="/login" className="text-sm text-blue-400 hover:text-blue-300 transition ml-auto">Login</Link>
        )}
      </div>
    </nav>
  );
}