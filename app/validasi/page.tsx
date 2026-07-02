"use client";
import { useRouter } from "next/navigation"; // Tambahkan import ini
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Sesuaikan path jika perlu


export default function ValidasiPage() {
  const [izinPending, setIzinPending] = useState<any[]>([]);
    const router = useRouter();

  // Fungsi untuk mengambil data izin yang masih Pending
  async function fetchPending() {
    const { data } = await supabase
      .from('tambah_izin')
      .select('*')
      .eq('status', 'Pending');
    
    if (data) setIzinPending(data);
  }

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // GANTI email di bawah ini dengan email akun Supabase Anda
      if (user?.email !== "raya@pintas.com") {
        router.push("/"); // Jika bukan Raya, paksa kembali ke dashboard utama
      }
    }
    checkAccess();
    fetchPending();
  }, []);

  // Fungsi untuk update status
  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('tambah_izin')
      .update({ status: status })
      .eq('id', id);

    if (error) {
      alert("Gagal update: " + error.message);
    } else {
      alert("Izin telah " + status);
      fetchPending(); // Refresh daftar setelah update
    }
  }

  return (
    <div className="p-8 bg-[#0F111A] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Pusat Validasi Izin Tim</h1>
      <div className="grid gap-4">
        {izinPending.map((item) => (
          <div key={item.id} className="bg-[#1C1F2E] p-4 rounded-xl flex justify-between items-center border border-slate-700">
            <div>
              <p className="font-bold text-white">{item.alasan}</p>
              <p className="text-xs text-slate-400">Tanggal: {item.tanggal_izin} | User ID: {item.user_id}</p>
            </div>
            <div className="space-x-2">
              <button 
                onClick={() => updateStatus(item.id, 'Disetujui')}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-bold"
              >Setujui</button>
              <button 
                onClick={() => updateStatus(item.id, 'Ditolak')}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold"
              >Tolak</button>
            </div>
          </div>
        ))}
        {izinPending.length === 0 && <p className="text-slate-500">Tidak ada pengajuan izin baru.</p>}
      </div>
    </div>
  );
}