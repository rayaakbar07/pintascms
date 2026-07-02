"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Car } from "lucide-react";

const getPlatformLogo = (platform: string) => {
  const logos: { [key: string]: string } = {
    'TikTok': '/logos/logo-tik-tok_578229-290.jpg.avif',
    'YouTube': '/logos/YouTube_full-color_icon_(2017).svg.png',
    'X': '/logos/vektor-logo-x-baru-twitter_768467-384.jpg.avif',
  };
  return logos[platform] || '/avatar-placeholder.png';
};

export default function Dashboard() {
  const [konten, setKonten] = useState<any[]>([]);
  const router = useRouter();
  const [userName, setUserName] = useState("Pintas Team"); // Nilai default

  const totalKonten = konten.length;
  const kontenPublikasi = konten.filter(k => k.status === 'Publikasi').length;
  const kontenShooting = konten.filter(k => k.status === 'Shooting').length;
  const kontenProsesEditing = konten.filter(k => k.status === 'Proses Editing').length;
  const kontenPengajuan = konten.filter(k => k.status === 'Pengajuan').length;
  const kontenIde = konten.filter(k => k.status === 'Ide').length;
  
  const dataGrafik = [
    { name: 'Ide', total: konten.filter(k => k.status === 'Ide').length },
    { name: 'Pengajuan', total: kontenPengajuan },
    { name: 'Shooting', total: kontenShooting },
    { name: 'Proses Editing', total: kontenProsesEditing },
    { name: 'Publikasi', total: kontenPublikasi },
  ];

  useEffect(() => {
    // 1. Mengambil data user
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Ambil bagian depan email sebagai nama (contoh: raya@pintas.com -> Raya)
        const name = user.email ? user.email.split('@')[0] : "Pintas Team";
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    }
    async function fetchData() {
      const { data, error} = await supabase.from('pintas_content').select('*');
      if (data) setKonten(data);
    }
    getUser();
    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0F111A] text-white p-8">
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="bg-blue-600 rounded-3xl p-8 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-3xl font-bold">Good Day, {userName}!</h1>
          <p className="text-blue-100">Jaga produktivitas dan kualitas visual Anda hari ini.</p>
        </div>
      </div>

        {/* --- ANALITIK --- */}
        {/* ANALITIK GRID - Kartu dengan latar gelap */}
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
      {/* GRAFIK & PROYEK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 bg-[#1C1F2E] border-slate-800 rounded-3xl p-6">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataGrafik}>
              <XAxis dataKey="name" stroke="rgb(151, 125, 125)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px' }} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {dataGrafik.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Shooting' ? '#60a5fa' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* LATEST PROJECTS LIST */}
      <div className="col-span-1 space-y-4">
  <h2 className="font-bold text-lg text-yellow-400">🔔 Tugas untuk Anda</h2>
  {konten
    .filter(item => {
      // Logika: Admin lihat semua, anggota tim hanya lihat tugas milik mereka
      // Pastikan 'userName' sudah didefinisikan di useEffect Anda
      const isRaya = userName.toLowerCase() === 'raya';
      return isRaya || item.pj_tugas?.toLowerCase() === userName.toLowerCase();
    })
    .slice(0, 3) // Tampilkan 4 tugas teratas
    .map((item) => (
      <Card key={item.id} className="bg-[#1C1F2E] border-slate-800 rounded-2xl p-4 hover:border-yellow-500/50 transition">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-white">{item.title}</p>
            <p className="text-[10px] text-slate-500">PJ: {item.pj_tugas || 'Belum di-assign'}</p>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-full">
            {item.status}
          </span>
        </div>
      </Card>
    ))
  }
</div>
      </div>
    </div>
  </div>
  );
 }