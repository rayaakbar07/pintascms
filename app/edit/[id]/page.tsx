"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter, useParams } from "next/navigation";

export default function EditKonten() {
  const [data, setData] = useState({ 
    title: "", 
    platform: "", 
    status: "", 
    link_pen: "", 
    link_up: "", 
    pj_tugas: "", 
    tanggal_pen: "" 
  });
  
  const params = useParams(); 
  const title = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  useEffect(() => {
    if (!title) return;
    
    async function fetchKonten() {
      const { data: konten, error } = await supabase
        .from('pintas_content')
        .select('*')
        .eq('title', decodeURIComponent(title))
        .single();
        
      if (konten) setData(konten);
      if (error) console.error("Error fetching:", error.message);
    }
    fetchKonten();
  }, [title]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('pintas_content')
      .update(data)
      .eq('title', decodeURIComponent(title)); 
      
    if (!error) {
      router.push("/");
      router.refresh();
    } else {
      alert("Gagal update: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus konten ini?")) return;
    const { error } = await supabase
      .from('pintas_content')
      .delete()
      .eq('title', decodeURIComponent(title)); 

    if (!error) {
      router.push("/");
      router.refresh();
    } else {
      alert("Gagal menghapus: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-[#0F111A] rounded-3xl border border-slate-800 shadow-xl text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Konten</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Judul Konten</label>
          <input 
            value={data.title} 
            onChange={(e) => setData({...data, title: e.target.value})} 
            className="w-full bg-[#1C1F2E] p-4 rounded-xl border border-slate-700 text-white outline-none focus:border-blue-500" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Platform</label>
            <select value={data.platform} onChange={(e) => setData({...data, platform: e.target.value})} className="w-full bg-[#1C1F2E] p-4 rounded-xl border border-slate-700 text-white">
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="X">X</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
            <select value={data.status} onChange={(e) => setData({...data, status: e.target.value})} className="w-full bg-[#1C1F2E] p-4 rounded-xl border border-slate-700 text-white">
              {["Ide", "Pengajuan", "Shooting", "Proses Editing", "Jadwalkan", "Publikasi"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Penanggung Jawab (PJ)</label>
          <select 
            value={data.pj_tugas || ""} 
            onChange={(e) => setData({...data, pj_tugas: e.target.value})} 
            className="w-full bg-[#1C1F2E] p-4 rounded-xl border border-slate-700 text-white"
          >
            <option value="">Pilih PJ...</option>
            <option value="shofi">Shofi</option>
            <option value="ama">Ama</option>
            <option value="tasha">Tasha</option>
            <option value="indira">Indira</option>
            <option value="raya">Raya</option>
            <option value="ice">Ice</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Tanggal Upload</label>
          <input 
            type="date"
            value={data.tanggal_pen ? data.tanggal_pen.split('T')[0] : ""} 
            onChange={(e) => setData({...data, tanggal_pen: e.target.value})} 
            className="w-full bg-[#1C1F2E] p-4 rounded-xl border border-slate-700 text-white"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition">
          Simpan Perubahan
        </button>
        
        <button type="button" onClick={handleDelete} className="w-full bg-transparent border border-red-900 text-red-400 py-4 rounded-xl font-bold hover:bg-red-900/20 transition">
          Hapus Konten
        </button>
      </form>
    </div>
  );
}