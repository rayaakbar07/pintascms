"use client";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [judul, setJudul] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  // 1. Tambahkan state untuk status, default ke "Pengajuan"
  const [status, setStatus] = useState("Pengajuan");
  const [tanggal_pen, setTanggalPen] = useState("");
  const [link_pen, setLinkPen] = useState("");
  const [link_up, setLinkUp] = useState("");
  const [pj_tugas, setPjTugas] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('pintas_content')
      .insert([{ 
        title: judul,
        platform: platform, 
        status: status, // 2. Gunakan state 'status'
        tanggal_pen: tanggal_pen,
        link_pen: link_pen,
        link_up: link_up,
        pj_tugas: pj_tugas// 3. Tambahkan field tanggal_pen
      }]);

    if (error) {
      alert("Gagal menambah konten: " + error.message);
    } else {
      alert("Konten berhasil ditambahkan!");
      setJudul(""); 
      setPlatform("TikTok");
      setStatus("Pengajuan"); // Reset ke default
      window.location.reload(); 
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10">
      <h1 className="text-2xl font-bold text-white mb-8 text-center">Tambah Konten Baru - Pintas</h1>
      
      <form onSubmit={handleSubmit} className="bg-#1C1F2E p-6 border rounded shadow-sm">
        {/* Input Judul */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Judul Konten</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full bg-[#0F111A] p-4 rounded-xl border border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan ide judul..."
            required
          />
        </div>
        
        {/* Dropdown Platform */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Pilih Platform</label>
          <select 
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-[#0F111A] p-4 rounded-xl border border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 outline-none transition"
          >
            <option value="TikTok">TikTok</option>
            <option value="X">X</option>
          </select>
        </div>

        {/* 3. Dropdown Status */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Status Konten</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-[#0F111A] p-4 rounded-xl border border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 outline-none transition"
          >
            <option value="Pengajuan">Pengajuan</option>
            <option value="Shooting">Shooting</option>
            <option value="Proses Editing">Proses Editing</option>
            <option value="Jadwalkan">Jadwalkan</option>
            <option value="Publikasi">Publikasi</option>
          </select>
        </div>
        {/* 3. Dropdown Penugasan - Letakkan di bawah Status Konten */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-slate-400">Tugaskan Kepada</label>
        <select 
          value={pj_tugas}
          onChange={(e) => setPjTugas(e.target.value)}
          className="w-full bg-[#0F111A] p-4 rounded-xl border border-slate-700 text-white focus:border-blue-500 outline-none transition"
        >
          <option value="">Pilih Anggota Tim</option>
          <option value="shofi">Shofi</option>
          <option value="ama">Ama</option>
          <option value="tasha">Tasha</option>
          <option value="raya">Raya</option>
          <option value="indira">Indira</option>
          <option value="ice">ice</option>
        </select>
      </div>
        {/* Input Tanggal Upload */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Link pengerjaan</label>
          <input
            type="text"
            value={link_pen}
            onChange={(e) => setLinkPen(e.target.value)}
            className="w-full bg-[#0F111A] p-4 rounded-xl border border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan link pengerjaan..."
            required
          />
        </div>
        <div className="mb-4">
        <label className="block mb-2 font-medium">Link publikasi</label>
          <input
            type="text"
            value={link_up}
            onChange={(e) => setLinkUp(e.target.value)}
            className="w-full bg-[#0F111A] p-4 rounded-xl border border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan link pengerjaan..."
            required
          />
        </div>
<label className="block text-sm font-medium">Tanggal Upload</label>
<input 
  type="date"
  value={tanggal_pen} 
  onChange={(e) => setTanggalPen(e.target.value)} 
  className="w-full bg-[#0F111A] p-4 rounded-xl border border-slate-700 text-white placeholder-slate-600 focus:border-blue-500 outline-none transition"
  />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Menyimpan..." : "Simpan ke Database"}
        </button>
      </form>
    </div>
  );
}