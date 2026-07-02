"use client";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";

export default function LaporanPage() {
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({ priority: "", highlight: "", blockers: "" });
  const router = useRouter();

  useEffect(() => {
    // Otomatis mengenali siapa yang login
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.email ? user.email.split('@')[0] : "Team";
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    }
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('pintas_reports').insert([{
      user_id: user?.id,
      user_email: user?.email,
      ...formData
    }]);

    if (!error) {
      alert("Laporan berhasil dikirim!");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F111A] p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Halo, {userName}!</h1>
        <p className="text-slate-400 mb-8">Silakan isi laporan tugas Anda hari ini.</p>
        
        <form onSubmit={handleSubmit} className="bg-[#1C1F2E] p-8 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <label className="text-sm text-blue-400 font-semibold">🌟 Priority</label>
            <textarea required onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full mt-2 bg-[#0F111A] p-4 rounded-xl border border-slate-700" rows={3}/>
          </div>
          <div>
            <label className="text-sm text-emerald-400 font-semibold">🌟 Highlight</label>
            <textarea required onChange={(e) => setFormData({...formData, highlight: e.target.value})} className="w-full mt-2 bg-[#0F111A] p-4 rounded-xl border border-slate-700" rows={3}/>
          </div>
          <div>
            <label className="text-sm text-red-400 font-semibold">🌟 Blockers</label>
            <textarea required onChange={(e) => setFormData({...formData, blockers: e.target.value})} className="w-full mt-2 bg-[#0F111A] p-4 rounded-xl border border-slate-700" rows={3}/>
          </div>
          <button className="w-full bg-blue-600 py-4 rounded-xl font-bold hover:bg-blue-700 transition">Kirim Laporan</button>
        </form>
      </div>
    </div>
  );
}