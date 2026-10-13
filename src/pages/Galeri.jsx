import { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const CATEGORIES = ['Semua', 'Aktivitas Kandang', 'Kontrol Kualitas', 'Distribusi & Logistik', 'Fasilitas Peternakan'];

export default function Galeri() {
  const [publicPhotos, setPublicPhotos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  // 1. AMBIL DATA DARI CLOUD (SYNC DENGAN ADMIN)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "gallery"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter: Hanya tampilkan konten yang di-set Live (isPublic === true)
        const filtered = data.filter((p) => p.isPublic === true);
        setPublicPhotos(filtered);
      } catch (error) {
        console.error("Gagal sinkronisasi data dari Cloud:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🛠️ FUNGSI PARSER: Mengonversi URL YouTube
  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const displayedPhotos = activeCategory === 'Semua' 
    ? publicPhotos 
    : publicPhotos.filter(p => p.category === activeCategory);

  return (
    <div className="w-full bg-stone-50 min-h-screen font-sans">
      
      {/* ── PAGE HEADER ── */}
      <section className="bg-gradient-to-br from-stone-800 to-stone-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #f59e0b 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 font-bold tracking-widest uppercase text-xs mb-3">Multi-Media Transparansi</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Galeri <span className="text-amber-400">Kegiatan</span>
          </h1>
          <p className="text-stone-400 text-base max-w-xl mx-auto leading-relaxed">
            Eksplorasi dokumentasi operasional CV Semesta Agro Sinergy melalui arsip foto kegiatan, video edukasi YouTube, hingga rilis media sosial resmi kami.
          </p>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-stone-900 shadow-sm shadow-amber-200'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── DYNAMIC GRID SECTION ── */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="text-center py-20 text-stone-500">Memuat data dari Cloud...</div>
          ) : displayedPhotos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPhotos.map((item) => {
                const ytId = item.mediaType === 'youtube' ? extractYoutubeId(item.imagePath) : null;
                return (
                  <div key={item.id} className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-300 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 flex flex-col justify-between">
                    <div className="w-full aspect-[1024/683] bg-stone-900 overflow-hidden relative border-b border-stone-100">
                      {item.mediaType === 'image' && (
                        <img src={item.imagePath} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      {item.mediaType === 'youtube' && ytId && (
                        <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytId}`} title={item.title} allowFullScreen></iframe>
                      )}
                      {item.mediaType === 'social' && (
                        <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-950 p-6 flex flex-col justify-center items-center text-center">
                          <div className="text-4xl mb-3">📱</div>
                          <p className="text-amber-400 font-bold text-xs">Konten Sosial Media</p>
                        </div>
                      )}
                      <span className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-sm text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-md z-10">{item.category}</span>
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] text-stone-400 font-medium mb-1">{item.date}</p>
                      <h3 className="text-stone-800 font-extrabold text-base mb-2">{item.title}</h3>
                      <p className="text-stone-500 text-xs leading-relaxed">{item.desc}</p>
                      {item.mediaType === 'social' && (
                        <a href={item.imagePath} target="_blank" rel="noreferrer" className="mt-4 block w-full text-center bg-stone-100 hover:bg-amber-500 text-stone-700 hover:text-stone-900 font-bold text-xs py-2.5 rounded-xl transition-all">
                          Buka Tautan Resmi
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300">
              <p className="text-stone-500 font-semibold">Belum ada dokumentasi media pada kategori ini.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}