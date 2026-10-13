import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../firebase"; // Pastikan path import firebase benar
import { collection, getDocs, query, where } from "firebase/firestore";

// PASTIKAN SAMA PERSIS dengan di file Admin
const CATEGORIES = ['Semua', 'Manajemen Kandang', 'Perawatan Fasilitas', 'Sanitasi & Kebersihan', 'Tips Umum'];

function ArticleCard({ article }) {
  return (
    <article className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-300 shadow-sm hover:shadow-xl hover:shadow-amber-100/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* 📸 FOTO ARTIKEL */}
      <div className="w-full h-48 overflow-hidden bg-stone-100 border-b border-stone-100 relative">
        <img 
          src={article.imagePath} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
            {article.category}
          </span>
          <span className="text-stone-400 text-xs">{article.date}</span>
        </div>

        <h2 className="text-stone-800 font-extrabold text-base leading-snug mb-3 group-hover:text-amber-700 transition-colors duration-200">
          {article.title}
        </h2>

        <p className="text-stone-500 text-sm leading-relaxed mb-5 flex-1">
          {article.summary}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
          <span className="text-stone-400 text-xs">{article.readTime}</span>
          <Link
            to={`/edukasi/${article.id}`}
            className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-bold text-xs transition-all duration-200 group-hover:gap-2"
          >
            Baca Selengkapnya
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function EdukasiList() {
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  // 1. AMBIL DATA DARI FIRESTORE (Sinkronisasi Realtime)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "articles"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter hanya yang public (isPublic === true)
        const publicArticles = data.filter(art => art.isPublic === true);
        setArticles(publicArticles);
      } catch (error) {
        console.error("Gagal mengambil data dari Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = activeCategory === 'Semua'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── HEADER ── */}
      <section className="bg-gradient-to-br from-stone-800 to-stone-900 py-16 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4">Edukasi <span className="text-amber-400">Agro</span></h1>
        <p className="text-stone-400 text-sm max-w-lg mx-auto">
          Artikel-artikel seputar manajemen kandang dan peternakan.
        </p>
      </section>

      {/* ── FILTER TABS ── */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat ? 'bg-amber-500 text-stone-900' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── GRID CONTENT ── */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 text-stone-500">Menghubungkan ke Cloud...</div>
          ) : filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-stone-400">Belum ada artikel yang tersedia.</div>
          )}
        </div>
      </section>
    </div>
  );
}