import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// IMPORT KONEKSI FIRESTORE
import { db } from "../firebase"; 
import { doc, getDoc } from "firebase/firestore";
// Logo default cadangan (fallback) jika admin belum meng-upload logo
import logoDefault from '../assets/download.jpg';

const quickLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/tentang-kami', label: 'Tentang Kami' },
  { to: '/produk', label: 'Katalog Produk' },
  { to: '/edukasi', label: 'Edukasi Agro' },
  { to: '/galeri', label: 'Galeri' }, 
  { to: '/kontak', label: 'Kontak Kami' },
];

export default function Footer() {
  const [waNumber, setWaNumber] = useState('6281234567890');
  const [dynamicLogo, setDynamicLogo] = useState('');

  // AMBIL DATA KONTAK & LOGO DINAMIS DARI FIRESTORE
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const docRef = doc(db, "settings", "website-data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.waNumber) setWaNumber(data.waNumber);
          if (data.logoUrl) setDynamicLogo(data.logoUrl);
        }
      } catch (error) {
        console.error("Gagal mengambil data untuk footer:", error);
      }
    };
    fetchFooterData();
  }, []);

  const waDefaultMessage = encodeURIComponent(
    'Halo Admin Sinergy! Saya ingin menanyakan informasi lebih lanjut mengenai produk Telur Sehat Sinergy.'
  );

  const socials = [
    { 
      label: 'Instagram', 
      icon: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 2C5.16 4 4 5.16 4 7.6v8.8C4 18.84 5.16 20 7.6 20h8.8c2.44 0 3.6-1.16 3.6-3.6V7.6C20 5.16 18.84 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 110 10A5 5 0 0112 7zm0 2a3 3 0 100 6 3 3 0 000-6z', 
      href: '#' 
    },
    { 
      label: 'Facebook', 
      icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', 
      href: '#' 
    },
    { 
      label: 'WhatsApp', 
      icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L.057 23.057a1 1 0 001.25 1.25l5.207-1.471A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.513-5.166-1.409l-.37-.22-3.827 1.082 1.082-3.827-.22-.37A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z', 
      href: `https://wa.me/${waNumber}?text=${waDefaultMessage}` 
    },
  ];

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {/* LOGO DINAMIS DARI DATABASE ATAU FALLBACK KE ASET LOKAL */}
              <img 
                src={dynamicLogo || logoDefault} 
                alt="Logo CV Semesta Agro Sinergy" 
                className="w-12 h-12 object-cover rounded-full shrink-0 shadow-md bg-stone-800"
                onError={(e) => {
                  e.target.src = logoDefault;
                }}
              />
              
              <div>
                <h3 className="text-white font-extrabold text-base leading-tight">CV Semesta Agro Sinergy</h3>
                <p className="text-amber-500 text-[10px] font-semibold tracking-widest uppercase mt-0.5">Peternakan Sehat & Alami</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
              Memproduksi telur premium berkualitas tinggi dari peternakan unggas sehat yang sepenuhnya bebas dari intervensi zat kimia. Kesehatan Anda adalah prioritas kami.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href !== '#' ? '_blank' : undefined}
                  rel={s.href !== '#' ? 'noreferrer' : undefined}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-500 flex items-center justify-center transition-colors duration-200 group"
                >
                  <svg className="w-4 h-4 text-stone-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Navigasi</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className="text-sm text-stone-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Lokasi Operasional</h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex gap-2.5">
                <svg className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-stone-300 font-semibold">Sinergi Warehouse</p>
                  <p className="text-stone-500">Perumahan umum griya jemani No.5,<br />Kota, Provinsi</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-1 text-amber-500 hover:text-amber-400 font-semibold transition-colors duration-200 text-xs"
                  >
                    Lihat di Google Maps →
                  </a>
                </div>
              </div>
              <div className="flex gap-2.5">
                <svg className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-stone-300 font-semibold">Hubungi Admin</p>
                  <a href={`tel:+${waNumber}`} className="text-stone-400 hover:text-amber-400 transition-colors font-mono">
                    +{waNumber}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 text-center">
          <p className="text-stone-500 text-xs tracking-wide">
            © {new Date().getFullYear()} CV Semesta Agro Sinergy. Seluruh hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}