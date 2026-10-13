import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Beranda from './pages/Beranda';
import TentangKami from './pages/TentangKami';
import ProdukKatalog from './pages/ProdukKatalog';
import EdukasiList from './pages/EdukasiList';
import ArticleDetail from './pages/ArticleDetail'; 
import Kontak from './pages/Kontak';
import Galeri from './pages/Galeri'; 

// ── IMPORT HALAMAN AUTH PANEL ADMIN ──
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';

// ── IMPORT HALAMAN MANAGEMENT CONTENT PANEL ADMIN ──
import AdminDashboard from './pages/admin/AdminDashboard';
import KelolaProduk from './pages/admin/KelolaProduk';
import KelolaEdukasi from './pages/admin/KelolaEdukasi';
import KelolaWebsite from './pages/admin/KelolaKontak'; 
import KelolaGaleri from './pages/admin/KelolaGaleri'; 

// ── IMPORT KOMPONEN SATPAM PROTEKSI ──
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── GRUP 1: HALAMAN PENGUNJUNG UMUM (Pakai Navbar & Footer) ── */}
        <Route
          path="/*"
          element = {
            <div className="flex flex-col min-h-screen bg-stone-50 font-body">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Beranda />} />
                  <Route path="/tentang-kami" element={<TentangKami />} />
                  <Route path="/produk" element={<ProdukKatalog />} />
                  <Route path="/edukasi" element={<EdukasiList />} />
                  <Route path="/edukasi/:id" element={<ArticleDetail />} /> 
                  <Route path="/kontak" element={<Kontak />} />
                  <Route path="/galeri" element={<Galeri />} /> 
                </Routes>
              </div>
              <Footer />
            </div>
          }
        />

        {/* ── GRUP 2: HALAMAN REGISTER & LOGIN ADMIN PANEL (Bisa diakses bebas tanpa login) ── */}
        <Route path="/admin/login" element={<Login />} /> 
        <Route path="/admin/register" element={<Register />} /> 

        {/* ── GRUP 3: PANEL MANAGEMENT CONTENT ADMIN (WAJIB DIBUNGKUS PROTEKSI) ── */}
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/produk" element={
          <ProtectedRoute><KelolaProduk /></ProtectedRoute>
        } />
        <Route path="/admin/edukasi" element={
          <ProtectedRoute><KelolaEdukasi /></ProtectedRoute>
        } />
        <Route path="/admin/website" element={
          <ProtectedRoute><KelolaWebsite /></ProtectedRoute>
        } /> 
        <Route path="/admin/galeri" element={
          <ProtectedRoute><KelolaGaleri /></ProtectedRoute>
        } /> 
      </Routes>
    </BrowserRouter>
  );
}