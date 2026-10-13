import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../../firebase"; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
// ── FIX LOGO: Import resmi foto logo perusahaan
import logoPerusahaan from '../../assets/download.jpg';

const GRADE_CATEGORIES = ['Semua', 'Grade A', 'Grade B', 'Grade C'];
const BADGE_OPTIONS = ['Best Seller', 'Populer', 'Promo', 'Tidak Ada'];

export default function KelolaProduk() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [adminFilter, setAdminFilter] = useState('Semua');

  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImagePath, setFormImagePath] = useState('');
  const [formGradeLabel, setFormGradeLabel] = useState('Grade A');
  const [formSize, setFormSize] = useState('Ukuran Besar');
  const [formBadge, setFormBadge] = useState('Best Seller');

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (error) { console.error("Gagal mengambil data:", error); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        canvas.height = img.width > MAX_WIDTH ? img.height * scale : img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setFormImagePath(canvas.toDataURL('image/webp', 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setFormName(product.name || '');
    setFormPrice(product.price || '');
    setFormWeight(product.weightRange || '');
    setFormDesc(product.desc || '');
    setFormImagePath(product.imagePath || '');
    setFormGradeLabel(product.gradeLabel || 'Grade A');
    setFormSize(product.size || 'Ukuran Besar');
    setFormBadge(product.badge || 'Best Seller'); 
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormName(''); setFormPrice(''); setFormWeight(''); setFormDesc(''); 
    setFormImagePath(''); setFormGradeLabel('Grade A'); setFormSize('Ukuran Besar'); setFormBadge('Best Seller');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formPrice) return alert('Mohon isi nama produk and harga!');

    const productData = {
      name: formName || '',
      gradeLabel: formGradeLabel || 'Grade A',
      size: formSize || 'Ukuran Besar',
      price: formPrice || '',
      weightRange: formWeight || '',
      badge: formBadge === 'Tidak Ada' ? '' : (formBadge || 'Best Seller'),
      imagePath: formImagePath || "/src/assets/produk A.png",
      desc: formDesc || '',
      isPublic: true
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), productData);
        alert('Data berhasil diperbarui!');
      } else {
        await addDoc(collection(db, "products"), productData);
        alert('Produk baru berhasil ditambahkan!');
      }
      resetForm();
      fetchData();
    } catch (error) {
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormName(''); setFormPrice(''); setFormWeight(''); setFormDesc(''); 
    setFormImagePath(''); setFormGradeLabel('Grade A'); setFormSize('Ukuran Besar'); setFormBadge('Best Seller');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus produk ini secara permanen?')) {
      await deleteDoc(doc(db, "products", id));
      fetchData();
    }
  };

  const togglePublic = async (id, currentStatus) => {
    await updateDoc(doc(db, "products", id), { isPublic: !currentStatus });
    fetchData();
  };

  const filteredProducts = adminFilter === 'Semua' ? products : products.filter(p => p.gradeLabel === adminFilter);

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col shrink-0 shadow-xl">
        <div className="p-5 border-b border-stone-800 flex items-center gap-2">
          {/* ── FIX LOGO: Mengganti teks SAS menjadi Foto Bulat Sempurna ── */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white shrink-0 shadow-sm border border-stone-700">
            <img src={logoPerusahaan} alt="Logo CV Semesta" className="w-full h-full object-cover" />
          </div>
          <div><h1 className="font-extrabold text-sm leading-tight">CV Semesta</h1><p className="text-amber-500 text-[10px] font-semibold tracking-widest uppercase">Admin Panel</p></div>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          <Link to="/admin" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🖥️ Beranda Dashboard</Link>
          <Link to="/admin/produk" className="block px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm shadow-md">🥚 Kelola Grade Produk</Link>
          <Link to="/admin/edukasi" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">📚 Kelola Artikel Edukasi</Link>
          <Link to="/admin/galeri" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🖼️ Kelola Galeri Link</Link>
          <Link to="/admin/website" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">✍️ Kelola Kata Website</Link>
          <div className="pt-10 border-t border-stone-800 mt-6">
            <Link to="/" className="block px-4 py-2.5 rounded-xl text-stone-400 hover:text-red-400 text-sm font-semibold transition-colors">⬅️ Keluar</Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-6 border-b border-stone-200 pb-4">
          <h2 className="text-2xl font-extrabold text-stone-800 tracking-tight">Manajemen Katalog Produk</h2>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border shadow-sm space-y-4 lg:col-span-1">
            <h3 className="font-extrabold text-base border-b pb-2">{editingId ? '✏️ Edit Produk' : '➕ Tambah Produk'}</h3>
            
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase">Nama Produk</label>
              <input type="text" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" placeholder="Nama Produk" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase">Grade</label>
                <select className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" value={formGradeLabel} onChange={(e) => setFormGradeLabel(e.target.value)}>
                    {GRADE_CATEGORIES.filter(g => g !== 'Semua').map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase">Ukuran</label>
                <input type="text" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" placeholder="Ukuran" value={formSize} onChange={(e) => setFormSize(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase">Harga</label>
                <input type="text" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" placeholder="Harga" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase">Gramasi</label>
                <input type="text" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" placeholder="Gramasi" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase">Badge Penjualan</label>
              <select className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" value={formBadge} onChange={(e) => setFormBadge(e.target.value)}>
                  {BADGE_OPTIONS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase">Gambar Produk</label>
              <input type="file" className="w-full text-xs mt-1" onChange={handleFileChange} />
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase">Deskripsi</label>
              <textarea className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" placeholder="Deskripsi" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
            </div>
            
            <button type="submit" className="w-full py-3 bg-amber-500 font-bold rounded-xl">{editingId ? '💾 Simpan' : '🚀 Publish'}</button>
            {editingId && <button type="button" onClick={handleCancelEdit} className="w-full py-2 bg-stone-100 text-stone-700 font-bold rounded-xl">Batal</button>}
          </form>

          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {GRADE_CATEGORIES.map(g => <button key={g} onClick={() => setAdminFilter(g)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${adminFilter === g ? 'bg-stone-800 text-white' : 'bg-white border'}`}>{g}</button>)}
            </div>
            <div className="space-y-4">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-4">
                     {p.imagePath && <img src={p.imagePath} className="w-12 h-12 rounded-lg object-cover" alt="thumb" />}
                     <div>
                        <h4 className="font-bold text-sm">{p.name}</h4>
                        <p className="text-[10px] text-stone-500">{p.gradeLabel} | {p.price}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => togglePublic(p.id, p.isPublic)} className={`px-3 py-1 rounded text-[10px] font-bold ${p.isPublic ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.isPublic ? 'Live' : 'Hidden'}</button>
                    <button onClick={() => handleEditClick(p)} className="text-amber-600 bg-amber-50 px-3 py-1 rounded text-[10px] font-bold">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 bg-red-50 px-3 py-1 rounded text-[10px] font-bold">Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}