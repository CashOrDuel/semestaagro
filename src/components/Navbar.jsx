import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// 1. Mengimpor file foto logo default dari folder assets
import logoPerusahaan from '../assets/download.jpg';

// IMPORT KONEKSI FIREBASE UNTUK LOGO DINAMIS
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/tentang-kami', label: 'Tentang Kami' },
  { to: '/produk', label: 'Produk' },
  { to: '/edukasi', label: 'Edukasi' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // State untuk menyimpan logo dinamis dari Firestore
  const [dynamicLogo, setDynamicLogo] = useState('');

  // Ambil logo dinamis dari Firebase Cloud saat komponen dimuat
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const docRef = doc(db, "settings", "website-data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().logoUrl) {
          setDynamicLogo(docSnap.data().logoUrl);
        }
      } catch (error) {
        console.error("Gagal memuat logo dari Cloud:", error);
      }
    };
    fetchLogo();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `relative text-sm font-semibold tracking-wide transition-colors duration-200 pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-500 after:transition-all after:duration-300 ${
      isActive
        ? 'text-amber-500 after:w-full'
        : 'text-stone-700 hover:text-amber-500 after:w-0 hover:after:w-full'
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md shadow-stone-200/60'
          : 'bg-white/90 backdrop-blur-sm border-b border-stone-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            {/* Logo: Menggunakan logo dinamis dari Cloud jika ada, atau fallback ke logoPerusahaan asset */}
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-amber-200 group-hover:shadow-md transition-shadow duration-300 bg-stone-100">
              <img 
                src={dynamicLogo || logoPerusahaan} 
                alt="Logo CV Semesta Agro Sinergy" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-stone-800 font-extrabold text-sm tracking-tight">CV Semesta</p>
              <p className="text-amber-600 text-xs font-semibold tracking-widest uppercase">Agro Sinergy</p>
            </div>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* CTA Button Desktop */}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L.057 23.057a1 1 0 001.25 1.25l5.207-1.471A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.513-5.166-1.409l-.37-.22-3.827 1.082 1.082-3.827-.22-.37A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-stone-100 px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'bg-amber-50 text-amber-600'
                    : 'text-stone-700 hover:bg-stone-50 hover:text-amber-500'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-center gap-2 bg-amber-500 text-white text-sm font-bold px-4 py-2.5 rounded-lg"
          >
            Chat via WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}