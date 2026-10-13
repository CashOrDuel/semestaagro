import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../../firebase";
import { collection, getCountFromServer } from "firebase/firestore";
// ── FIX LOGO: Import resmi foto logo perusahaan
import logoPerusahaan from '../../assets/download.jpg';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, articles: 0, gallery: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const pSnap = await getCountFromServer(collection(db, "products"));
        const aSnap = await getCountFromServer(collection(db, "articles"));
        const gSnap = await getCountFromServer(collection(db, "gallery"));

        setStats({
          products: pSnap.data().count,
          articles: aSnap.data().count,
          gallery: gSnap.data().count
        });
      } catch (error) {
        console.error("Gagal sinkronisasi statistik:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar Kontrol Kiri */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col shrink-0 shadow-xl">
        <div className="p-5 border-b border-stone-800 flex items-center gap-2">
          {/* ── FIX LOGO: Mengganti teks SAS menjadi Foto Bulat Sempurna ── */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white shrink-0 shadow-sm border border-stone-700">
            <img src={logoPerusahaan} alt="Logo CV Semesta" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm leading-tight">CV Semesta</h1>
            <p className="text-amber-500 text-[10px] font-semibold tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="block px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm shadow-md">🖥️ Beranda Dashboard</Link>
          <Link to="/admin/produk" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🥚 Kelola Grade Produk</Link>
          <Link to="/admin/edukasi" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">📚 Kelola Artikel Edukasi</Link>
          <Link to="/admin/galeri" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🖼️ Kelola Galeri Link</Link>
          <Link to="/admin/website" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">✍️ Kelola Kata Website</Link>
          <div className="pt-10 border-t border-stone-800 mt-6">
            <Link to="/" className="block px-4 py-2.5 rounded-xl text-stone-400 hover:text-red-400 text-sm font-semibold transition-colors">⬅️ Keluar</Link>
          </div>
        </nav>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-8">
        <header className="mb-8 border-b border-stone-200 pb-5">
          <h2 className="text-3xl font-black text-stone-800 tracking-tight">Selamat Datang, Admin Sinergy!</h2>
          <p className="text-stone-500 text-sm mt-1">Panel kendali pusat manajemen data dan operasional konten CV Semesta Agro Sinergy.</p>
        </header>

        {/* Ringkasan Statistik */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden group">
            <div className="absolute right-4 bottom-2 text-7xl opacity-10 select-none">🥚</div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Katalog Produk</p>
            <p className="text-4xl font-black text-stone-800">{stats.products} <span className="text-xs text-stone-400 font-normal">Data di Cloud</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden group">
            <div className="absolute right-4 bottom-2 text-7xl opacity-10 select-none">📚</div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Total Artikel</p>
            <p className="text-4xl font-black text-stone-800">{stats.articles} <span className="text-xs text-stone-400 font-normal">Materi Edukasi</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden group">
            <div className="absolute right-4 bottom-2 text-7xl opacity-10 select-none">🖼️</div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Total Galeri</p>
            <p className="text-4xl font-black text-stone-800">{stats.gallery} <span className="text-xs text-stone-400 font-normal">Media Tersimpan</span></p>
          </div>
        </div>
        
        {/* Tombol Pintas Grid 2x2 */}
        <div className="grid md:grid-cols-2 gap-4">
            <Link to="/admin/produk" className="bg-stone-800 hover:bg-stone-900 transition-all duration-200 text-white p-6 rounded-2xl flex items-center justify-between shadow-lg">
                <span className="font-bold">Tambah Produk Baru</span>
                <span className="text-xl">🥚</span>
            </Link>
            <Link to="/admin/edukasi" className="bg-amber-500 hover:bg-amber-600 transition-all duration-200 text-stone-900 p-6 rounded-2xl flex items-center justify-between shadow-lg">
                <span className="font-bold">Tulis Artikel Edukasi</span>
                <span className="text-xl">📝</span>
            </Link>
            <Link to="/admin/galeri" className="bg-amber-500 hover:bg-amber-600 transition-all duration-200 text-stone-900 p-6 rounded-2xl flex items-center justify-between shadow-lg">
                <span className="font-bold">Tambah Foto Galeri</span>
                <span className="text-xl">📷</span>
            </Link>
            <Link to="/admin/website" className="bg-stone-800 hover:bg-stone-900 transition-all duration-200 text-white p-6 rounded-2xl flex items-center justify-between shadow-lg">
                <span className="font-bold">Kelola Kata Website</span>
                <span className="text-xl">✍️</span>
            </Link>
        </div>
      </main>
    </div>
  );
}