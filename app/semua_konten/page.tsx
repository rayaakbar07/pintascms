"use client";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Link from "next/link";

export default function SemuaKonten() {
  const [konten, setKonten] = useState<any[]>([]);
  // 1. State untuk konfigurasi sort
  const [sortConfig, setSortConfig] = useState({ key: 'tanggal_pen', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('pintas_content').select('*');
      if (error) console.error("Error fetching data:", error);
      else setKonten(data || []);
    }
    fetchData();
  }, []);

  // 2. Fungsi untuk handle klik header
  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  // 3. Logika Sorting sebelum ditampilkan
  const sortedKonten = [...konten].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Logika Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedKonten.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedKonten.length / itemsPerPage);

  // Fungsi Hapus Semua
  const deleteAll = async () => {
    if (!confirm("PERINGATAN: Semua data akan dihapus permanen! Lanjutkan?")) return;
    const { error } = await supabase.from('pintas_content').delete().neq('id', 0);
    if (!error) {
      setKonten([]);
      alert("Data berhasil dibersihkan.");
    } else {
      alert("Gagal menghapus: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F111A] p-8 text-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Manajemen Semua Konten</h1>
          <Link href="/tambah" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition font-semibold">
            Tambah Baru
          </Link>
        </div>

        <div className="bg-[#1C1F2E] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-sm uppercase tracking-wider">
                {/* 4. Menambahkan onClick pada header untuk trigger sort */}
                {['title', 'platform', 'tanggal_pen', 'status', 'pj_tugas'].map((key) => (
                  <th key={key} className="px-6 py-4 cursor-pointer hover:text-blue-400 transition" onClick={() => handleSort(key)}>
                    {key.replace('_', ' ')} ↕
                  </th>
                ))}
                <th className="px-6 py-4">Link Pengerjaan</th>
                <th className="px-6 py-4">Link Publikasi</th>
                <th className="px-6 py-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {/* 5. Mapping menggunakan sortedKonten */}
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#25293d] transition">
                  <td className="px-6 py-4 text-white font-medium">{item.title}</td>
                  <td className="px-6 py-4 text-slate-300">{item.platform}</td>
                  <td className="px-6 py-4 text-slate-300">
                    {item.tanggal_pen ? new Date(item.tanggal_pen).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs font-medium border border-slate-700">{item.status}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{item.pj_tugas}</td>
                  <td className="px-6 py-4">
                    {item.link_pen ? <a href={item.link_pen} target="_blank" className="text-blue-400 underline">Link Disini</a> : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {item.link_up ? <a href={item.link_up} target="_blank" className="text-blue-400 underline">Link Disini</a> : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/edit/${item.title}`} className="text-blue-400 hover:text-white transition">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="p-6 flex justify-center items-center gap-4 border-t border-slate-800 bg-[#1C1F2E]">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-30 hover:bg-slate-700"
            >
              Sebelumnya
            </button>
            <span className="text-slate-400">Halaman {currentPage} dari {totalPages || 1}</span>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-30 hover:bg-slate-700"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}