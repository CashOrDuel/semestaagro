import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
// ── FIX LOGO: Import resmi foto logo perusahaan
import logoPerusahaan from '../../assets/download.jpg';

const CATEGORIES = ['Aktivitas Kandang', 'Kontrol Kualitas', 'Distribusi & Logistik', 'Fasilitas Peternakan'];

export default function KelolaGaleri() {
  const [photos, setPhotos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [adminFilter, setAdminFilter] = useState('Semua');

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formMediaType, setFormMediaType] = useState('image');
  const [formDesc, setFormDesc] = useState('');
  const [formImagePath, setFormImagePath] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gallery"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPhotos(data);
      } catch (error) { console.error("Gagal mengambil data dari Cloud:", error); }
    };
    fetchData();
  }, []);

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

  const handleEditClick = (photo) => {
    setEditingId(photo.id);
    setFormTitle(photo.title);
    setFormCategory(photo.category);
    setFormMediaType(photo.mediaType || 'image');
    setFormDesc(photo.desc);
    setFormImagePath(photo.imagePath);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormTitle(''); setFormCategory(CATEGORIES[0]); setFormMediaType('image'); setFormDesc(''); setFormImagePath('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle) return alert('Mohon isi Judul!');
    
    const galleryData = {
      title: formTitle,
      category: formCategory,
      mediaType: formMediaType,
      desc: formDesc,
      imagePath: formImagePath,
      isPublic: true,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "gallery", editingId), galleryData);
        alert('Data berhasil diperbarui!');
      } else {
        await addDoc(collection(db, "gallery"), galleryData);
        alert('Data berhasil ditambahkan!');
      }
      window.location.reload();
    } catch (error) { alert('Gagal menyimpan: ' + error.message); }
  };

  const togglePublic = async (id, currentStatus) => {
    await updateDoc(doc(db, "gallery", id), { isPublic: !currentStatus });
    window.location.reload();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus data ini?')) {
      await deleteDoc(doc(db, "gallery", id));
      window.location.reload();
    }
  };

  const filteredPhotos = adminFilter === 'Semua' ? photos : photos.filter(p => p.category === adminFilter);

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
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🖥️ Beranda Dashboard</Link>
          <Link to="/admin/produk" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🥚 Kelola Grade Produk</Link>
          <Link to="/admin/edukasi" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">📚 Kelola Artikel Edukasi</Link>
          <Link to="/admin/galeri" className="block px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm shadow-md">🖼️ Kelola Galeri Link</Link>
          <Link to="/admin/website" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">✍️ Kelola Kata Website</Link>
          <div className="pt-10 border-t border-stone-800 mt-6">
            <Link to="/" className="block px-4 py-2.5 rounded-xl text-stone-400 hover:text-red-400 text-sm font-semibold transition-colors">⬅️ Keluar</Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-6 border-b border-stone-200 pb-4">
          <h2 className="text-2xl font-extrabold text-stone-800 tracking-tight">Manajemen Galeri</h2>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border shadow-sm space-y-4 lg:col-span-1">
            <h3 className="text-stone-800 font-extrabold text-base border-b pb-2">{editingId ? '✏️ Edit Media' : '📷 Tambah Media'}</h3>
            <input type="text" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" placeholder="Judul" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
            
            <label className="text-[10px] font-bold text-stone-500 uppercase">Kategori</label>
            <select className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
            </select>
            
            <select className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" value={formMediaType} onChange={(e) => { setFormMediaType(e.target.value); setFormImagePath(''); }}>
              <option value="image">🖼️ Foto Lokal</option>
              <option value="youtube">📺 Video YouTube</option>
              <option value="social">🔗 Tautan Media Sosial</option>
            </select>

            {formMediaType === 'image' ? (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Upload Foto</label>
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-amber-500">
                  {formImagePath ? <img src={formImagePath} className="w-16 h-16 object-cover rounded-lg" alt="preview" /> : <p className="text-xs text-stone-400">Klik pilih gambar</p>}
                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            ) : (
              <input type="text" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" placeholder="URL Link" value={formImagePath} onChange={(e) => setFormImagePath(e.target.value)} />
            )}

            <textarea className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" placeholder="Deskripsi" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
            <button type="submit" className="w-full py-3 bg-amber-500 text-stone-900 font-bold rounded-xl">{editingId ? '💾 Simpan' : '🚀 Publish'}</button>
            {editingId && <button type="button" onClick={handleCancelEdit} className="w-full py-2 bg-stone-100 text-stone-700 font-bold rounded-xl">Batal</button>}
          </form>

          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['Semua', ...CATEGORIES].map(cat => (
                    <button key={cat} onClick={() => setAdminFilter(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${adminFilter === cat ? 'bg-stone-800 text-white' : 'bg-white border text-stone-600'}`}>{cat}</button>
                ))}
            </div>
            
            <div className="space-y-4">
              {filteredPhotos.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-4 border flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-xl">{p.mediaType === 'image' ? '🖼️' : p.mediaType === 'youtube' ? '📺' : '🔗'}</div>
                    <div>
                        <h4 className="font-bold text-sm text-stone-800">{p.title}</h4>
                        <p className="text-xs text-stone-500">{p.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => togglePublic(p.id, p.isPublic)} className={`px-2 py-1 rounded text-[10px] font-bold ${p.isPublic ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.isPublic ? 'Live' : 'Hidden'}</button>
                    <button onClick={() => handleEditClick(p)} className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-[10px] font-bold">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 bg-red-50 px-2 py-1 rounded text-[10px] font-bold">Hapus</button>
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