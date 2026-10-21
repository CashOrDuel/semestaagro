import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import logoDefault from '../../assets/download.jpg'; // Fallback jika data kosong

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dynamicLogo, setDynamicLogo] = useState(''); // Menyimpan logo dari Firestore
  const navigate = useNavigate();

  // Ambil logo dari Firestore secara real-time saat halaman dibuka
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const docRef = doc(db, "settings", "website-data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().logoUrl) {
          setDynamicLogo(docSnap.data().logoUrl); // Set logo dari Firestore
        }
      } catch (err) {
        console.error("Gagal memuat logo dari Firestore:", err);
      }
    };
    fetchLogo();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      return setError('Mohon isi semua kolom!');
    }
    if (password !== confirmPassword) {
      return setError('Konfirmasi kata sandi tidak cocok!');
    }
    if (password.length < 6) {
      return setError('Kata sandi minimal harus 6 karakter!');
    }

    try {
      setError('');
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      alert('Akun Admin berhasil dibuat! Silakan login.');
      navigate('/admin/login');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email ini sudah terdaftar sebagai admin!');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format penulisan email tidak valid!');
      } else {
        setError(`Gagal mendaftarkan akun admin baru. Error: [${err.code}]`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-xl p-8 space-y-6">
        
        {/* Identitas Brand */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-md mx-auto border bg-white">
            <img 
              src={dynamicLogo || logoDefault} 
              alt="Logo Perusahaan" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h2 className="text-stone-900 font-extrabold text-xl tracking-tight">Daftar Admin Baru</h2>
            <p className="text-amber-600 text-xs font-bold tracking-widest uppercase mt-0.5">CV Semesta Agro Sinergy</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Email Admin</label>
            <input 
              type="email" 
              className="w-full text-sm bg-stone-50 border rounded-lg p-2.5 text-stone-800 focus:outline-amber-500" 
              placeholder="nama@semestaagro.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Kata Sandi (Password)</label>
            <input 
              type="password" 
              className="w-full text-sm bg-stone-50 border rounded-lg p-2.5 text-stone-800 focus:outline-amber-500" 
              placeholder="Minimal 6 karakter" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Ulangi Kata Sandi</label>
            <input 
              type="password" 
              className="w-full text-sm bg-stone-50 border rounded-lg p-2.5 text-stone-800 focus:outline-amber-500" 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-extrabold rounded-xl transition-all shadow-md disabled:opacity-50 text-sm"
            >
              {loading ? 'Memproses Pendaftaran...' : '📝 Daftarkan Akun Admin'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
          Sudah punya akun?{' '}
          <Link to="/admin/login" className="text-amber-600 font-bold hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}