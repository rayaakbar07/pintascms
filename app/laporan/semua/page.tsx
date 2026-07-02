"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";

export default function SemuaLaporan() {
  const [laporan, setLaporan] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState("Semua"); // Filter PJ
  const [currentPage, setCurrentPage] = useState(1);     // Pagination
  const itemsPerPage = 5; 
  const router = useRouter();

  useEffect(() => {
    async function fetchLaporan() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'raya@pintas.com') {
        setAuthorized(true);
        const { data } = await supabase.from('pintas_reports').select('*').order('time', { ascending: false });
        if (data) setLaporan(data);
      } else {
        router.push("/");
      }
      setLoading(false);
    }
    fetchLaporan();
  }, [router]);

  // Logika Filter & Pagination
  const filteredData = laporan.filter(r => 
    filterUser === "Semua" || r.user_email?.split('@')[0].toLowerCase() === filterUser.toLowerCase()
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#0F111A] p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Semua Daily Reports (Akses Admin)</h1>

        {/* Filter PJ */}
        <div className="mb-6 bg-[#1C1F2E] p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <span className="text-slate-400">Filter Laporan per User:</span>
          <select 
            value={filterUser} 
            onChange={(e) => { setFilterUser(e.target.value); setCurrentPage(1); }}
            className="bg-[#0F111A] border border-slate-700 p-2 rounded-lg text-white"
          >
            <option value="Semua">Semua Anggota</option>
            <option value="shofi">Shofi</option>
            <option value="ama">Ama</option>
            <option value="tasha">Tasha</option>
            <option value="indira">Indira</option>
            <option value="ice">Ice</option>
          </select>
        </div>

        {/* List Laporan */}
        <div className="space-y-4">
          {currentItems.map((r) => (
            <div key={r.id} className="bg-[#1C1F2E] p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between border-b border-slate-700 pb-2 mb-2">
                <span className="font-bold text-blue-400">{r.user_email}</span>
                <span className="text-xs text-slate-500">{new Date(r.time).toLocaleDateString()}</span>
              </div>
              <p className="text-sm"><strong className="text-blue-400">Priority:</strong> {r.priority}</p>
              <p className="text-sm"><strong className="text-emerald-400">Highlight:</strong> {r.highlight}</p>
              <p className="text-sm"><strong className="text-red-400">Blockers:</strong> {r.blockers}</p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-30"
          >Sebelumnya</button>
          <span className="text-slate-400">Halaman {currentPage} dari {totalPages || 1}</span>
          <button 
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-30"
          >Berikutnya</button>
        </div>
      </div>
    </div>
  );
}