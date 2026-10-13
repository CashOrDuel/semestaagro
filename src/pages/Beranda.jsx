import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// IMPORT KONEKSI FIRESTORE
import { db } from "../firebase"; 
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

// IMPORT GAMBAR AMAN (MENGGUNAKAN MODUL IMPORT VITE)
import heroBgImg from '../assets/hero-bg.png';
import produkImgFinal from '../assets/edukasi-pilihan.png'; // Gambar Baki Telur untuk Produk
import edukasiImgFinal from '../assets/produk-pilihan.png'; // Gambar Tangan & Ayam untuk Edukasi

const values = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: '100% Bebas Zat Kimia',
    desc: 'Tidak ada antibiotik, hormon sintetis, atau bahan kimia dalam seluruh proses budidaya. Murni alami dari kandang hingga meja makan Anda.',
    color: 'amber',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: 'Kontrol Kualitas Premium',
    desc: 'Setiap butir telur melalui seleksi ketat berdasarkan ukuran, kebersihan cangkang, dan kepadatan kuning telur sebelum sampai ke tangan Anda.',
    color: 'stone',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Pengiriman Higienis Langsung',
    desc: 'Dikemas dengan standar higienitas tinggi dan dikirimkan langsung dari peternakan ke tangan konsumen untuk menjamin kesegaran maksimal.',
    color: 'amber',
  },
];

export default function Beranda() {
  const [heroBgExists, setHeroBgExists] = useState(false);

  // State Sinkronisasi Data Cloud
  const [siteTexts, setSiteTexts] = useState({});
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [eduTip, setEduTip] = useState(null);

  // 1. SINKRONISASI HERO & CONFIG DATA
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "website-data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setSiteTexts(docSnap.data());
      } catch (e) { console.error("Gagal sinkron teks beranda:", e); }
    };

    // 2. SINKRONISASI PRODUK PILIHAN
    const fetchFeaturedProduct = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const liveProducts = data.filter(p => p.isPublic === true);
        if (liveProducts.length > 0) {
          const best = liveProducts.find(p => p.badge === 'Best Seller') || liveProducts[0];
          setFeaturedProduct(best);
        }
      } catch (e) { console.error("Gagal sinkron produk pilihan:", e); }
    };

    // 3. SINKRONISASI ARTIKEL EDUKASI TERBARU
    const fetchLatestArticle = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "articles"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (data.length > 0) {
          setEduTip(data[0]);
        }
      } catch (e) { console.error("Gagal sinkron artikel edukasi:", e); }
    };

    fetchSettings();
    fetchFeaturedProduct();
    fetchLatestArticle();
  }, []);

  // Cek background hero
  useEffect(() => {
    const img = new Image();
    img.src = heroBgImg;
    img.onload = () => setHeroBgExists(true);
    img.onerror = () => setHeroBgExists(false);
  }, []);

  return (
    <div>
      {/* ── HERO SECTION ── */}
      <section 
        className={`relative bg-cover bg-center bg-no-repeat overflow-hidden transition-all duration-500 ${
          heroBgExists 
            ? 'min-h-[85vh] flex items-center' 
            : 'bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950' 
        }`}
        style={heroBgExists ? { backgroundImage: `url(${heroBgImg})` } : {}}
      >
        {heroBgExists && <div className="absolute inset-0 bg-stone-950/30 z-10" />}
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full translate-x-1/2 -translate-y-1/4 pointer-events-none z-15" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 rounded-full -translate-x-1/2 translate-y-1/4 pointer-events-none z-15" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 z-20">
          <div className="max-w-2xl bg-stone-950/40 p-6 rounded-2xl backdrop-blur-[2px] sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
            <span className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6 border border-amber-500/30">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Peternakan Unggas Sehat #1
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              {siteTexts.heroTitle ? (
                <>
                  {siteTexts.heroTitle.split(',')[0]}, {' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                    {siteTexts.heroTitle.split(',')[1] || ''}
                  </span>
                </>
              ) : (
                <>Telur Premium, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">100% Alami</span> & Bebas Kimia</>
              )}
            </h1>

            <p className="text-stone-200 text-lg leading-relaxed mb-8 max-w-xl">
              {siteTexts.heroDesc || "CV Semesta Agro Sinergy hadir sebagai pelopor peternakan unggas bersih yang tidak menggunakan intervensi kimia apapun menghasilkan telur berkualitas tinggi untuk kesehatan keluarga Indonesia."}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/edukasi"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
              >
                Pelajari Selengkapnya
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-full border border-white/20 transition-all duration-200 hover:-translate-y-0.5 text-sm"
              >
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Kunjungi Sinergi Warehouse di Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="relative h-16 z-20">
          <svg viewBox="0 0 1440 64" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full">
            <path d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" fill="#fafaf9" />
          </svg>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-stone-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2">Komitmen Kami</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight">Mengapa Memilih Sinergy?</h2>
            <p className="text-stone-500 mt-3 max-w-xl mx-auto text-base">Tiga pilar utama yang menjadi fondasi kepercayaan ribuan konsumen kami.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="group relative bg-white rounded-2xl p-7 border border-stone-200 hover:border-amber-300 shadow-sm hover:shadow-xl hover:shadow-amber-100/60 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-600 mb-5 transition-colors duration-300">
                  {v.icon}
                </div>
                <h3 className="text-stone-800 font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DYNAMIC HIGHLIGHT WITH PICTURES ── */}
      <section className="bg-white py-20 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2">Unggulan Kami</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight">Produk & Tips Terbaru</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Kartu Featured Product */}
            <div className="relative bg-gradient-to-br from-amber-50 to-stone-50 rounded-2xl p-6 border border-amber-200 overflow-hidden group hover:shadow-xl hover:shadow-amber-100 transition-all duration-300 hover:-translate-y-1">
              {(featuredProduct?.badge || 'Best Seller') && (
                <span className="absolute top-5 right-5 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  {featuredProduct?.badge || 'Best Seller'}
                </span>
              )}
              
              <div className="w-full h-48 rounded-xl overflow-hidden mb-5 bg-stone-100 shadow-inner flex items-center justify-center">
                <img 
                  src={featuredProduct?.imagePath || produkImgFinal} 
                  alt={featuredProduct?.name || 'Telur Sehat Sinergy'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="bg-stone-800 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md">
                  {featuredProduct?.gradeLabel || 'Grade A'}
                </span>
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                  {featuredProduct?.size || 'Ukuran Besar'}
                </span>
              </div>
              <h3 className="text-stone-800 font-extrabold text-xl mt-3 mb-2">{featuredProduct?.name || 'Telur Sehat Sinergy'}</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-5">{featuredProduct?.desc || 'Telur omega premium dengan kuning telur pekat keemasan — tanda nyata dari pakan alami tanpa rekayasa kimia.'}</p>
              <Link to="/produk" className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-bold text-sm transition-colors group-hover:gap-2.5 duration-200">
                Lihat Katalog Produk →
              </Link>
            </div>

            {/* Kartu Edu Tip */}
            <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl p-6 border border-stone-700 overflow-hidden group hover:shadow-xl hover:shadow-stone-900/40 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full translate-x-1/3 -translate-y-1/3" />
              
              <div className="w-full h-48 rounded-xl overflow-hidden mb-5 bg-stone-950 shadow-inner flex items-center justify-center">
                <img 
                  src={eduTip?.imagePath || edukasiImgFinal} 
                  alt={eduTip?.title || 'Edukasi Sinergy'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
                />
              </div>

              <span className="inline-block bg-amber-500/20 text-amber-400 text-xs font-bold tracking-wide px-3 py-1 rounded-full border border-amber-500/30 mb-3">
                {eduTip?.category || 'Kualitas Telur'}
              </span>
              <h3 className="text-white font-extrabold text-xl mb-3 leading-snug">{eduTip?.title || 'Apa yang Membuat Telur Omega Lebih Unggul dari Telur Biasa?'}</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-5">{eduTip?.summary || eduTip?.desc || 'Kandungan omega-3 yang tinggi pada telur kami bukan kebetulan. Pelajari bagaimana manajemen pakan alami secara langsung meningkatkan nilai gizi telur.'}</p>
              <Link to="/edukasi" className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold text-sm transition-colors group-hover:gap-2.5 duration-200">
                Baca Artikel →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-amber-500 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-stone-900 text-2xl sm:text-3xl font-extrabold mb-3">Siap Beralih ke Telur yang Lebih Sehat?</h2>
          <p className="text-stone-800/80 text-base mb-7">Konsultasikan kebutuhan Anda langsung dengan tim kami melalui WhatsApp. Gratis, cepat, dan ramah.</p>
          <a
            href={`https://wa.me/${siteTexts.waNumber || "6281234567890"}?text=Halo%20Sinergy%2C%20saya%20ingin%20mengetahui%20lebih%20lanjut%20tentang%20produk%20telur%20sehat.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L.057 23.057a1 1 0 001.25 1.25l5.207-1.471A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.513-5.166-1.409l-.37-.22-3.827 1.082 1.082-3.827-.22-.37A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Chat Sekarang via WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}