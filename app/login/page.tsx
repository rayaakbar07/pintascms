"use client";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push("/"); // Arahkan ke Dashboard setelah sukses
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F111A]">
      <form onSubmit={handleLogin} className="bg-[#1C1F2E] p-8 rounded-3xl w-96 border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6">Login Pintas</h2>
        <input 
          type="email" placeholder="Email" className="w-full p-3 mb-4 bg-[#0F111A] rounded-xl border border-slate-700 text-white"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Password" className="w-full p-3 mb-6 bg-[#0F111A] rounded-xl border border-slate-700 text-white"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <Button className="w-full bg-blue-600 rounded-xl">Masuk</Button>
      </form>
    </div>
  );
}