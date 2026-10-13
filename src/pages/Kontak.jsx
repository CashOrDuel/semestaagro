import { useState, useEffect } from 'react';
// IMPORT KONEKSI FIRESTORE
import { db } from "../firebase"; 
import { doc, getDoc } from "firebase/firestore";

// Data Fallback Cadangan jika Firestore kosong
const defaultFaqs = [
  { q: 'Apakah bisa pembelian dalam jumlah besar / grosir?', a: 'Ya! Kami melayani pembelian eceran maupun grosir.' },
  { q: 'Apakah tersedia layanan pengiriman?', a: 'Kami menyediakan layanan pengiriman ke area tertentu.' },
  { q: 'Bagaimana cara memastikan kesegaran telur?', a: 'Seluruh telur kami dikemas dan dikirim maksimal H+2 dari tanggal produksi.' },
];

const defaultHours = [
  { day: 'Senin – Jumat', hours: '08.00 – 17.00 WIB' },
  { day: 'Sabtu', hours: '08.00 – 14.00 WIB' },
  { day: 'Minggu & Hari Libur', hours: 'Tutup' },
];

export default function Kontak() {
  const [siteTexts, setSiteTexts] = useState({});
  const [loading, setLoading] = useState(true);

  // AMBIL DATA TEKS DARI CLOUD FIRESTORE
  useEffect(() => {
    const fetchTexts = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "settings", "website-data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSiteTexts(docSnap.data());
        }
      } catch (error) {
        console.error("Gagal mengambil data kontak dari Cloud:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTexts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-500 font-semibold">
        Memuat data kontak...
      </div>
    );
  }

  const waNumberClean = siteTexts.waNumber || '6281234567890';
  const waDefaultMessage = encodeURIComponent('Halo Admin Sinergy! Saya ingin menanyakan informasi lebih lanjut mengenai produk Telur Sehat Sinergy.');
  const waLink = `https://wa.me/${waNumberClean}?text=${waDefaultMessage}`;

  // Sinkronisasi Array dari Firebase
  const displayedFaqs = siteTexts.faqs || defaultFaqs;
  const displayedHours = siteTexts.operationalHours || defaultHours;

  const contactDetails = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Lokasi Operasional',
      value: 'Sinergi Warehouse',
      sub: 'Jl. [Alamat Lengkap], Kota, Provinsi',
      link: 'https://maps.google.com',
      linkLabel: 'Buka di Google Maps →',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Nomor Telepon / WhatsApp',
      value: siteTexts.waNumber ? `+${siteTexts.waNumber}` : '+62 812-3456-7890',
      sub: 'Tersedia Senin – Sabtu, Silakan cek jam kerja di tabel samping',
      link: `tel:+${waNumberClean}`,
      linkLabel: 'Hubungi Sekarang →',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Email',
      value: 'info@semestaagro.com',
      sub: 'Respon dalam 1x24 jam kerja',
      link: 'mailto:info@semestaagro.com',
      linkLabel: 'Kirim Email →',
    },
  ];

  return (
    <div>
      {/* ── PAGE HEADER ── */}
      <section className="bg-gradient-to-br from-stone-800 to-stone-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #f59e0b 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <p className="text-amber-400 font-bold tracking-widest uppercase text-xs mb-3">Hubungi Kami</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Kontak & <span className="text-amber-400">Pemesanan</span>
          </h1>
          <p className="text-stone-400 text-base max-w-xl mx-auto leading-relaxed">
            {siteTexts.contactDesc || "Ada pertanyaan? Ingin memesan? Tim Sinergy siap membantu Anda."}
          </p>
        </div>
      </section>

      {/* ── MAIN WA CTA ── */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* Kiri: Tombol WA & Detail Kontak */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-5 shadow-md">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L.057 23.057a1 1 0 001.25 1.25l5.207-1.471A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.513-5.166-1.409l-.37-.22-3.827 1.082 1.082-3.827-.22-.37A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                </div>
                <h2 className="text-stone-800 font-extrabold text-2xl mb-2">Chat via WhatsApp</h2>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                  Cara tercepat untuk konsultasi produk, cek ketersediaan stok, atau melakukan pemesanan. Kami siap membalas pesan Anda!
                </p>
                
                {/* ── IKON WA KEMBALI DIMASUKKAN KE SINI ── */}
                <a href={waLink} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-md text-base">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L.057 23.057a1 1 0 001.25 1.25l5.207-1.471A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.513-5.166-1.409l-.37-.22-3.827 1.082 1.082-3.827-.22-.37A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  Mulai Chat WhatsApp Sekarang
                </a>
                <p className="text-stone-400 text-xs mt-3">📱 Nomor WhatsApp: <strong>+{waNumberClean}</strong></p>
              </div>

              <div className="space-y-4">
                {contactDetails.map((c, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border shadow-sm flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">{c.icon}</div>
                    <div className="flex-1">
                      <p className="text-stone-400 text-xs font-semibold mb-0.5">{c.label}</p>
                      <p className="text-stone-800 font-bold text-sm">{c.value}</p>
                      <p className="text-stone-500 text-xs">{c.sub}</p>
                      {c.link && <a href={c.link} target="_blank" rel="noreferrer" className="inline-block mt-1.5 text-amber-600 font-bold text-xs">{c.linkLabel}</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kanan: FAQ & JAM OPERASIONAL SINKRON CLOUD */}
            <div className="space-y-6 w-full">
              <div>
                <p className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-3">FAQ</p>
                <h2 className="text-stone-800 font-extrabold text-2xl mb-6">Pertanyaan yang Sering Diajukan</h2>
                <div className="space-y-4">
                  {displayedFaqs.map((faq, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border shadow-sm">
                      <p className="text-stone-800 font-bold text-sm mb-2 flex items-start gap-2">
                        <span className="text-amber-500 font-extrabold shrink-0">Q.</span>{faq.q}
                      </p>
                      <p className="text-stone-500 text-sm leading-relaxed pl-5">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* JAM OPERASIONAL DINAMIS */}
              <div className="bg-stone-800 rounded-xl p-6 text-white shadow-md">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Jam Operasional Peternakan & Warehouse
                </h3>
                <div className="space-y-2 text-sm">
                  {displayedHours.map((h, i) => (
                    <div key={i} className="flex justify-between text-stone-300 border-b border-stone-700 pb-1.5 last:border-0 last:pb-0">
                      <span>{h.day}</span>
                      <span className={`font-semibold ${h.hours === 'Tutup' ? 'text-red-400' : 'text-amber-400'}`}>
                        {h.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}