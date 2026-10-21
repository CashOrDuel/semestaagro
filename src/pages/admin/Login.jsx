import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import logoDefault from '../../assets/download.jpg'; // Fallback jika belum ada logo

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ambil logo secara instan dari LocalStorage yang diatur oleh admin
  const currentLogo = localStorage.getItem('cachedLogo') || logoDefault;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Mohon masukkan email dan password!');
    }

    try {
      setError('');
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Email atau kata sandi salah. Akses ditolak!');
      } else {
        setError('Gagal masuk. Periksa kembali jaringan internet Anda.');
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
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-md mx-auto border bg-stone-100">
            <img 
              src={currentLogo} 
              alt="Logo CV Semesta Agro Sinergy" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.src = logoDefault;
              }}
            />
          </div>
          <div>
            <h2 className="text-stone-900 font-extrabold text-xl tracking-tight">Admin Dashboard Login</h2>
            <p className="text-amber-600 text-xs font-bold tracking-widest uppercase mt-0.5">CV Semesta Agro Sinergy</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Email Terdaftar</label>
            <input 
              type="email" 
              className="w-full text-sm bg-stone-50 border rounded-lg p-2.5 text-stone-800 focus:outline-amber-500" 
              placeholder="admin@semestaagro.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Kata Sandi</label>
            <input 
              type="password" 
              className="w-full text-sm bg-stone-50 border rounded-lg p-2.5 text-stone-800 focus:outline-amber-500" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-900 font-extrabold rounded-xl transition-all shadow-md disabled:opacity-50 text-sm tracking-wide"
            >
              {loading ? 'Memverifikasi Data...' : '🔒 Masuk ke Dashboard'}
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-stone-100 space-y-3">
          <div className="text-xs text-stone-500">
            Belum memiliki kredensial akun admin?
          </div>
          <Link 
            to="/admin/register" 
            className="w-full inline-flex items-center justify-center py-2.5 border border-stone-300 hover:border-amber-500 rounded-xl text-xs font-bold text-stone-700 hover:text-amber-600 transition-all bg-white hover:bg-amber-50/30"
          >
            📝 Buat Akun Admin Baru
          </Link>

          <div className="pt-1">
            <Link to="/" className="text-stone-400 hover:text-stone-600 text-[11px] font-semibold transition-colors">
              ← Kembali ke Beranda Utama Website
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}