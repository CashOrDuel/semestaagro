import { useState, useEffect } from 'react';
import { db } from "../firebase"; 
import { doc, onSnapshot } from "firebase/firestore";

const milestones = [
  { year: '2018', event: 'Pendirian CV Semesta Agro Sinergy dengan visi peternakan bebas kimia.' },
  { year: '2019', event: 'Mulai produksi komersial Telur Sehat Sinergy dari kandang pertama.' },
  { year: '2021', event: 'Perluasan kapasitas kandang dan sertifikasi standar higienitas mandiri.' },
  { year: '2023', event: 'Peluncuran Sinergi Warehouse sebagai pusat distribusi & edukasi konsumen.' },
  { year: '2025', event: 'Meluncurkan platform digital untuk memperluas jangkauan edukasi agro-pangan.' },
];

const teamValues = [
  { icon: '🌱', title: 'Alami dari Akarnya', desc: 'Tidak ada kompromi terhadap penggunaan antibiotik, hormon, atau pestisida dalam rantai produksi kami.' },
  { icon: '🤝', title: 'Transparansi Penuh', desc: 'Kami terbuka tentang proses, grading, dan standar produksi kami kepada seluruh konsumen.' },
  { icon: '📚', title: 'Edukasi Berkelanjutan', desc: 'Kami percaya konsumen yang teredukasi adalah fondasi ketahanan pangan yang lebih sehat.' },
  { icon: '💛', title: 'Kesehatan Keluarga', desc: 'Setiap keputusan operasional kami selalu berpusat pada satu tujuan: kesehatan keluarga Indonesia.' },
];

const defaultStoryText = "CV Semesta Agro Sinergy berakar dari sebuah kegelisahan <strong>sederhana namun mendalam</strong>: mengapa makanan yang seharusnya menyehatkan justru penuh dengan intervensi kimia?<br><br>Didirikan oleh seorang pengusaha yang memiliki visi kuat dalam bidang ketahanan pangan, perusahaan ini dibangun atas keyakinan bahwa peternakan unggas modern <strong>tidak harus mengorbankan kesehatan konsumen</strong> demi efisiensi produksi.<br><br>Dari awal berdirinya, seluruh proses budidaya di Semesta Agro Sinergy dirancang untuk sepenuhnya <strong>bebas dari intervensi zat kimia</strong> — tidak ada antibiotik pertumbuhan, tidak ada hormon sintetis, dan tidak ada pestisida dalam rantai pakan.<br><br>Hasilnya adalah <strong>Telur Sehat Sinergy</strong> — produk unggulan yang bukan hanya telur, tapi merupakan komitmen nyata terhadap kesehatan keluarga Indonesia.";

export default function TentangKami() {
  const finalAboutTelur = "/src/assets/about-telur.png";
  const [imageExists, setImageExists] = useState(false);
  const [siteTexts, setSiteTexts] = useState({});

  // AMBIL DATA SECARA REAL-TIME DENGAN ONSNAPSHOT
  useEffect(() => {
    const docRef = doc(db, "settings", "website-data");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSiteTexts(docSnap.data());
      }
    }, (error) => {
      console.error("Gagal mendengarkan data real-time:", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = finalAboutTelur;
    img.onload = () => setImageExists(true);
    img.onerror = () => setImageExists(false);
  }, [finalAboutTelur]);

  const rawStoryText = (siteTexts.aboutStoryText && siteTexts.aboutStoryText.trim() !== "") 
    ? siteTexts.aboutStoryText 
    : defaultStoryText;

  return (
    <div>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-stone-800 to-stone-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #f59e0b 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 font-bold tracking-widest uppercase text-xs mb-3">Profil Perusahaan</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Tentang <span className="text-amber-400">Kami</span>
          </h1>
          <p className="text-stone-400 text-base max-w-xl mx-auto leading-relaxed">
            Mengenal lebih dalam visi, misi, dan perjalanan CV Semesta Agro Sinergy dalam membangun ekosistem peternakan unggas yang bersih dan bertanggung jawab.
          </p>
        </div>
      </section>

      {/* ── ORIGIN STORY ── */}
      <section className="bg-stone-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Text */}
            <div>
              <p className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-3">Kisah Kami</p>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-800 mb-6 leading-tight">
                {siteTexts.aboutStoryTitle || "Lahirlah dari Visi Pribadi, Tumbuh untuk Bangsa"}
              </h2>
              
              <div 
                className="space-y-4 text-stone-600 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: rawStoryText }}
              />
            </div>

            {/* Visual Stats */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: '100%', label: 'Bebas Antibiotik', icon: '🚫' },
                { value: '2018', label: 'Tahun Berdiri', icon: '📅' },
                { value: 'Grade A & B', label: 'Standar Produk', icon: '🥚' },
                { value: '100%', label: 'Pakan Alami', icon: '🌾' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-300 shadow-sm hover:shadow-md transition-all duration-200 text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-extrabold text-stone-800 mb-1">{stat.value}</div>
                  <div className="text-stone-500 text-xs font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE SERVICE ── */}
      <section className="bg-amber-500 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-stone-900/70 font-bold tracking-widest uppercase text-xs mb-2">Layanan Utama</p>
              <h2 className="text-stone-900 text-2xl sm:text-3xl font-extrabold mb-4 leading-tight">
                Menghadirkan Telur Sehat Langsung ke Tangan Anda
              </h2>
              <p className="text-stone-800/80 text-sm leading-relaxed">
                Melalui produk andalan kami, <strong>Telur Sehat Sinergi</strong>, kami tidak hanya menjual telur — kami menyampaikan nilai kesehatan, transparansi, dan kepercayaan kepada setiap konsumen yang memilih untuk hidup lebih sehat.
              </p>
            </div>
            
            <div 
              className={`relative rounded-2xl p-8 text-center bg-cover bg-center overflow-hidden shadow-xl min-h-[250px] flex flex-col justify-center items-center ${
                imageExists ? '' : 'bg-stone-900'
              }`}
              style={imageExists ? { backgroundImage: `url(${finalAboutTelur})` } : {}}
            >
              <div className={`absolute inset-0 z-10 ${imageExists ? 'bg-stone-950/40' : 'bg-transparent'}`} />
              <div className="relative z-20">
                <h3 className="text-white font-extrabold text-2xl mb-2 tracking-tight">Telur Sehat Sinergi</h3>
                <p className="text-stone-300 text-xs md:text-sm mb-5 max-w-xs mx-auto">Diproduksi dengan standar tertinggi. Bebas kimia. Kaya nutrisi alami.</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <span className="bg-amber-500 text-stone-950 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Grade A</span>
                  <span className="bg-amber-500 text-stone-950 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Grade B</span>
                  <span className="bg-white/10 text-stone-200 text-xs font-bold px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">Omega-3 Tinggi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-white py-20 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2">Nilai Perusahaan</p>
            <h2 className="text-3xl font-extrabold text-stone-800">Prinsip yang Memandu Kami</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamValues.map((v) => (
              <div key={v.title} className="group bg-stone-50 hover:bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-stone-800 font-bold text-sm mb-2">{v.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="bg-stone-50 py-20 border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2">Perjalanan Kami</p>
            <h2 className="text-3xl font-extrabold text-stone-800">Tonggak Sejarah Sinergy</h2>
          </div>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-stone-200" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="relative flex gap-6 items-start">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-amber-500 text-stone-900 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-md shadow-amber-200">
                    {m.year.slice(2)}
                  </div>
                  <div className="bg-white rounded-xl px-5 py-4 border border-stone-200 flex-1 shadow-sm">
                    <span className="text-amber-600 font-bold text-xs">{m.year}</span>
                    <p className="text-stone-700 text-sm mt-1 leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}