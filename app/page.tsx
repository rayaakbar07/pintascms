"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const [konten, setKonten] = useState<any[]>([]);
  const [userName, setUserName] = useState("Pintas Team");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [izinSaya, setIzinSaya] = useState<any[]>([]);
  
  const [alasan, setAlasan] = useState("");
  const [tanggalIzin, setTanggalIzin] = useState("");
  
  const router = useRouter();

  async function ajukanIzin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Anda harus login!");
    
    const { error } = await supabase.from('tambah_izin').insert([
      { user_id: user.id, alasan, tanggal_izin: tanggalIzin, status: 'Pending' }
    ]);

    if (error) alert("Gagal: " + error.message);
    else {
      alert("Izin berhasil diajukan!");
      setAlasan("");
      setTanggalIzin("");
      fetchIzinSaya();
    }
  }

  async function fetchIzinSaya() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        console.log("User yang sedang login ID-nya:", user.id); // <--- CEK INI DI CONSOLE
        const { data } = await supabase.from('tambah_izin').select('*').eq('user_id', user.id);
        if (data) {
            console.log("Data izin yang ditarik:", data); // <--- CEK APAKAH DATANYA BENAR
            setIzinSaya(data);
        }
    }
    }

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.email ? user.email.split('@')[0] : "Pintas Team";
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
        const { data: profileData } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();
        if (profileData?.avatar_url) setUserPhoto(profileData.avatar_url);
      }
      const { data: kontenData } = await supabase.from('pintas_content').select('*');
      if (kontenData) setKonten(kontenData);
    }
    fetchData();
    fetchIzinSaya();
  }, [router]);

  const totalKonten = konten.length;
  const kontenPublikasi = konten.filter(k => k.status === 'Publikasi').length;
  const kontenShooting = konten.filter(k => k.status === 'Shooting').length;
  const kontenProsesEditing = konten.filter(k => k.status === 'Proses Editing').length;
  const kontenPengajuan = konten.filter(k => k.status === 'Pengajuan').length;
  const kontenIde = konten.filter(k => k.status === 'Ide').length;
  
  const dataGrafik = [
    { name: 'Ide', total: konten.filter(k => k.status === 'Ide').length },
    { name: 'Pengajuan', total: konten.filter(k => k.status === 'Pengajuan').length },
    { name: 'Shooting', total: konten.filter(k => k.status === 'Shooting').length },
    { name: 'Editing', total: konten.filter(k => k.status === 'Proses Editing').length },
    { name: 'Publikasi', total: konten.filter(k => k.status === 'Publikasi').length },
  ];

  return (
    <div className="min-h-screen bg-[#0F111A] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
          {/* Header */}
          <div className="relative bg-blue-600 rounded-3xl p-8 flex items-center shadow-lg h-40 overflow-hidden">
          <div className="flex-1 z-10 pl-10"> 
            <h1 className="text-3xl font-bold">Good Day, {userName}!</h1>
            <p className="text-blue-100">Jaga produktivitas dan kualitas visual Anda hari ini.</p>
          </div>
    
      {/* Logika Tampilan Gambar */}
      <div className="relative -left-4 -bottom-6 z-0">
        {userPhoto && userPhoto !== "" ? (
          // Jika user sudah login dan ada fotonya
          <img 
            src={userPhoto} 
            alt="Profile" 
            className="h-60 w-auto object-contain drop-shadow-2xl" 
          />
        ) : (
          // Jika user belum login atau foto tidak ada
          <img 
            src="/gambar/pintas_team.png"
            alt="Tim Pintas" 
            className="h-40 w-auto object-contain drop-shadow-2xl" 
          />
        )}
      </div>
    </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: 'Total', val: totalKonten, color: 'text-white' },
            { label: 'Publikasi', val: kontenPublikasi, color: 'text-green-400' },
            { label: 'Shooting', val: kontenShooting, color: 'text-blue-400' },
            { label: 'Editing', val: kontenProsesEditing, color: 'text-yellow-400' },
            { label: 'Pengajuan', val: kontenPengajuan, color: 'text-purple-400' },
            { label: 'Ide', val: kontenIde, color: 'text-gray-400' },
          ].map((stat, i) => (
            <Card key={i} className="bg-[#1C1F2E] border-slate-800 rounded-3xl">
              <CardContent className="p-4 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.val}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <Card className="bg-[#1C1F2E] border-slate-800 rounded-3xl p-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dataGrafik}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F111A', borderRadius: '12px' }} />
                  <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Bagian Tugas untuk Anda yang Hilang */}
            <h2 className="font-bold text-lg text-yellow-400">🔔 Tugas untuk Anda</h2>
            {konten.filter(item => {
                const isRaya = userName.toLowerCase() === 'raya';
                return isRaya || item.pj_tugas?.toLowerCase() === userName.toLowerCase();
              }).slice(0, 3).map((item) => (
                <Card key={item.id} className="bg-[#1C1F2E] border-slate-800 rounded-2xl p-4 hover:border-yellow-500/50 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-[10px] text-slate-500">PJ: {item.pj_tugas || 'Belum di-assign'}</p>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{item.status}</span>
                  </div>
                </Card>
              ))
            }
          </div>

          <div className="col-span-1 space-y-4">
            <Card className="bg-[#1C1F2E] border-slate-800 rounded-3xl p-4">
              <h2 className="font-bold text-sm text-yellow-400 mb-2">✍️ Ajukan Izin</h2>
              <input type="date" value={tanggalIzin} onChange={(e) => setTanggalIzin(e.target.value)} className="bg-[#0F111A] p-2 rounded-xl border border-slate-700 w-full text-white mb-2" />
              <textarea placeholder="Alasan..." value={alasan} onChange={(e) => setAlasan(e.target.value)} className="bg-[#0F111A] p-2 rounded-xl border border-slate-700 w-full h-16 text-white mb-2" />
              <button onClick={ajukanIzin} className="w-full bg-blue-600 py-2 rounded-xl font-bold text-sm">Kirim</button>
            </Card>

            <h2 className="font-bold text-lg text-yellow-400 mt-4">📋 Status Izin Anda</h2>
            {izinSaya.map(item => (
              <div key={item.id} className="bg-[#1C1F2E] p-3 rounded-xl text-sm border border-slate-700">
                <p className="font-bold">{item.alasan}</p>
                <p className="text-[10px] text-slate-400">Tanggal: {item.tanggal_izin} | Status: 
                  <span className={item.status === 'Disetujui' ? 'text-green-500' : 'text-yellow-500'}> {item.status}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}