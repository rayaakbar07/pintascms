"use client";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ValidasiPage() {
  const [izinPending, setIzinPending] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPending() {
      const { data } = await supabase.from('tambah_izin').select('*').eq('status', 'Pending');
      if (data) setIzinPending(data);
    }
    fetchPending();
  }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from('tambah_izin').update({ status }).eq('id', id);
    setIzinPending(izinPending.filter(i => i.id !== id));
  }

  return (
    <div className="p-8 bg-[#0F111A] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Validasi Izin Tim</h1>
      {izinPending.map(item => (
        <div key={item.id} className="bg-[#1C1F2E] p-4 rounded-xl mb-3 flex justify-between">
          <div>
            <p className="font-bold">{item.alasan}</p>
            <p className="text-xs text-slate-400">Tanggal: {item.tanggal_izin}</p>
          </div>
          <div className="space-x-2">
            <button onClick={() => updateStatus(item.id, 'Disetujui')} className="bg-green-600 px-4 py-2 rounded">Setuju</button>
            <button onClick={() => updateStatus(item.id, 'Ditolak')} className="bg-red-600 px-4 py-2 rounded">Tolak</button>
          </div>
        </div>
      ))}
    </div>
  );
}