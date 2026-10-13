import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// IMPORT KONEKSI FIRESTORE & FIREBASE FUNCTIONS
import { db } from "../firebase"; // ⚠️ Pastikan letak path "../firebase" ini sudah benar
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function ArticleDetail() {
  const { id } = useParams();
  
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        
        // 1. AMBUL DATA ARTIKEL UTAMA BERDASARKAN ID
        const docRef = doc(db, "articles", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Artikel tidak ditemukan di Firestore!");
        }

        // 2. AMBIL ARTIKEL LAIN UNTUK REKOMENDASI DI BAGIAN BAWAH
        const querySnapshot = await getDocs(collection(db, "articles"));
        const allArticles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // MODIFIKASI: Filter & batasi MAKSIMAL HANYA 2 CARD (.slice(0, 2))
        const others = allArticles
          .filter(a => a.id !== id && a.isPublic === true)
          .slice(0, 2);
          
        setRelated(others);
      } catch (error) {
        console.error("Gagal sinkronisasi data detail dari Cloud:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-stone-50">
        <div className="w-9 h-9 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-stone-500 text-xs font-semibold">Mengambil konten dari Cloud Sinergy...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <p className="text-stone-700 font-extrabold text-lg mb-2">⚠️ Data Artikel Tidak Ditemukan</p>
        <Link to="/edukasi" className="text-amber-600 font-bold text-sm hover:underline">
          ← Kembali ke Lembar Edukasi
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans antialiased">
      {/* Tombol Navigasi Kembali */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to="/edukasi" className="text-stone-500 hover:text-amber-600 font-bold text-xs inline-flex items-center gap-1 transition-colors">
          ← Kembali ke Halaman Edukasi
        </Link>
      </div>

      {/* Konten Utama Artikel Dinamis */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Judul Utama di Tengah */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 mt-2 mb-6 leading-tight text-center tracking-tight">
          {article.title}
        </h1>

        {/* Badge & Keterangan Waktu di Sebelah Kiri Atas-Bawah */}
        <div className="flex flex-col items-start gap-2 mb-6 border-b border-stone-100 pb-6">
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wider">
            {article.category}
          </span>
          <p className="text-stone-400 text-xs font-medium flex items-center gap-1.5">
            <span>📅 {article.date || 'Baru saja'}</span>
            <span>•</span>
            <span>⏱️ {article.readTime || '5 Menit'} baca</span>
          </p>
        </div>
        
        {/* Foto Cover Artikel */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl sm:rounded-3xl mb-8 bg-stone-100 border shadow-sm">
          <img src={article.imagePath} className="w-full h-full object-cover" alt={article.title} />
        </div>
        
        {/* Ringkasan Singkat (Style Blockquote) */}
        {article.summary && (
          <p className="text-stone-800 font-semibold text-sm sm:text-base mb-6 leading-relaxed bg-stone-50 p-4 border-l-4 border-amber-500 rounded-r-xl italic">
            "{article.summary}"
          </p>
        )}

        {/* Isi Paragraf Panjang Komplit */}
        <div className="text-stone-700 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-4 pt-2">
          {article.content ? (
            article.content
          ) : (
            <span className="text-stone-400 italic text-xs">Isi teks lengkap artikel belum diunggah oleh admin.</span>
          )}
        </div>
      </div>

      {/* ── MODIFIKASI SEKSI ARTIKEL TERKAIT ── */}
      {/* Jika artikel baru ada 1 (artinya 'related' kosong []), bagian di bawah ini TIDAK AKAN MUNCUL SAMA SEKALI */}
      {related.length > 0 && (
        <section className="bg-stone-50 py-12 border-t border-stone-200 mt-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg font-extrabold text-stone-800 mb-6">📚 Baca Artikel Lainnya</h3>
            
            {/* Menggunakan grid-cols-1 sm:grid-cols-2 agar posisi pas berjejer KIRI-KANAN secara simetris */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              {related.map(item => (
                <Link 
                  to={`/edukasi/${item.id}`} 
                  key={item.id} 
                  className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col group"
                >
                  <div className="w-full h-32 overflow-hidden rounded-lg mb-3 bg-stone-100">
                    <img src={item.imagePath} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                  </div>
                  <h4 className="font-bold text-stone-800 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}
    </div>
  );
}