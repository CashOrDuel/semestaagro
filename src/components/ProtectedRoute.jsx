
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase'; // ⚠️ Pastikan path ke file firebase.js kamu sudah benar
import { onAuthStateChanged } from 'firebase/auth';

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengecek status login admin secara real-time dari Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Selesai loading setelah Firebase memberikan jawaban
    });

    return () => unsubscribe();
  }, []);

  // ⏳ HANDLE LOADING: Firebase butuh waktu beberapa milidetik untuk ngecek token saat page di-refresh.
  // Jika tidak diberi loading, admin yang sudah login bisa tidak sengaja terlempar ke halaman login lagi.
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-stone-500 text-xs font-bold tracking-wide animate-pulse">Memeriksa Otorisasi Admin...</p>
        </div>
      </div>
    );
  }

  // 🔒 PROTEKSI: Jika tidak ada user yang login, tendang ke halaman login admin
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ LOLOS: Jika ada user, tampilkan halaman admin asli
  return children;
}