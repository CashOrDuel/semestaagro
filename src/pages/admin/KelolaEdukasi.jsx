import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
// ── FIX LOGO: Import resmi foto logo perusahaan
import logoPerusahaan from '../../assets/download.jpg';

const CATEGORIES = ['Manajemen Kandang', 'Perawatan Fasilitas', 'Sanitasi & Kebersihan', 'Tips Umum'];

export default function KelolaEdukasi() {
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [readTime, setReadTime] = useState('5 menit');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState(''); 
  const [imagePath, setImagePath] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "articles"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArticles(data);
      } catch (error) {
        console.error("Gagal mengambil data dari Cloud:", error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        
        if (img.width > MAX_WIDTH) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImagePath(canvas.toDataURL('image/webp', 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = (article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setCategory(article.category);
    setReadTime(article.readTime);
    setSummary(article.summary);
    setContent(article.content || ''); 
    setImagePath(article.imagePath);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setCategory(CATEGORIES[0]);
    setReadTime('5 menit');
    setSummary('');
    setContent(''); 
    setImagePath('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !summary || !content) return alert('Mohon isi judul, ringkasan, dan isi lengkap artikel!');

    const articleData = {
      title,
      category,
      readTime,
      summary,
      content, 
      imagePath: imagePath || '/src/assets/artikel-1.png',
      isPublic: true,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    try {
      if (editingId) {
        delete articleData.isPublic;
        await updateDoc(doc(db, "articles", editingId), articleData);
        alert('Artikel berhasil diperbarui!');
      } else {
        await addDoc(collection(db, "articles"), articleData);
        alert('Artikel baru berhasil diterbitkan!');
      }
      window.location.reload();
    } catch (error) {
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const togglePublic = async (id, currentStatus) => {
    await updateDoc(doc(db, "articles", id), { isPublic: !currentStatus });
    window.location.reload();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus artikel ini secara permanen?')) {
      try {
        await deleteDoc(doc(db, "articles", id));
        window.location.reload();
      } catch (error) {
        alert('Gagal menghapus data.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      {/* Sidebar Menu Samping */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col shrink-0 shadow-xl">
        <div className="p-5 border-b border-stone-800 flex items-center gap-2">
          {/* ── FIX LOGO: Mengganti teks SAS menjadi Foto Bulat Sempurna ── */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white shrink-0 shadow-sm border border-stone-700">
            <img src={logoPerusahaan} alt="Logo CV Semesta" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm leading-tight">CV Semesta</h1>
            <p className="text-amber-500 text-[10px] font-semibold tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🖥️ Beranda Dashboard</Link>
          <Link to="/admin/produk" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🥚 Kelola Grade Produk</Link>
          <Link to="/admin/edukasi" className="block px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm shadow-md">📚 Kelola Artikel Edukasi</Link>
          <Link to="/admin/galeri" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🖼️ Kelola Galeri Link</Link>
          <Link to="/admin/website" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">✍️ Kelola Kata Website</Link>
          <div className="pt-10 border-t border-stone-800 mt-6">
            <Link to="/" className="block px-4 py-2.5 rounded-xl text-stone-400 hover:text-red-400 text-sm font-semibold">⬅️ Keluar</Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {/* ── SEKARANG KELAS WARNA SUDAH FIX JELAS DAN TANPA KATA (CLOUD) ── */}
        <header className="mb-6 border-b border-stone-200 pb-4">
          <h2 className="text-2xl font-extrabold text-stone-800 tracking-tight">Manajemen Blog Edukasi</h2>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Form Input Data */}
          <form onSubmit={handleSubmit} className={`bg-white rounded-2xl p-6 border shadow-sm space-y-4 lg:col-span-1 ${editingId ? 'border-amber-400' : 'border-stone-200'}`}>
            <h3 className="text-stone-800 font-extrabold text-base border-b pb-2">{editingId ? '✏️ Mode Sunting' : '✍️ Tulis Artikel Baru'}</h3>
            <input type="text" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" placeholder="Judul Artikel" value={title} onChange={(e) => setTitle(e.target.value)} />
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Foto Artikel</label>
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-stone-50 transition-all">
                {imagePath ? <img src={imagePath} className="w-16 h-16 object-cover rounded-lg shadow-sm" alt="preview" /> : <p className="text-xs text-stone-400 font-semibold">Klik untuk pilih gambar</p>}
                <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              {imagePath && <button type="button" onClick={() => setImagePath('')} className="text-xs text-red-500 font-bold hover:underline">Hapus Gambar</button>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select className="w-full text-xs bg-stone-50 border rounded-lg p-2.5 font-semibold" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="text" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" placeholder="5 menit" value={readTime} onChange={(e) => setReadTime(e.target.value)} />
            </div>
            
            <textarea rows="3" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5" placeholder="Ringkasan pendek (untuk halaman depan)..." value={summary} onChange={(e) => setSummary(e.target.value)} />
            <textarea rows="10" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5 leading-relaxed focus:outline-amber-500" placeholder="Tulis isi lengkap artikel/paragraf di sini..." value={content} onChange={(e) => setContent(e.target.value)} />
            
            <button type="submit" className={`w-full py-3 rounded-xl font-bold ${editingId ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-stone-900'}`}>
              {editingId ? '💾 Simpan' : '🚀 Terbitkan'}
            </button>
            {editingId && <button type="button" onClick={handleCancelEdit} className="w-full bg-stone-100 py-2 rounded-xl text-xs font-bold">Batal</button>}
          </form>

          {/* Kolom Daftar Artikel di Firebase */}
          <div className="lg:col-span-2 space-y-4">
            {articles.map((art) => (
              <div key={art.id} className="bg-white rounded-2xl p-5 border shadow-sm flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  {art.imagePath && <img src={art.imagePath} className="w-12 h-12 object-cover rounded-lg" alt="thumb" />}
                  <div className="space-y-1 max-w-xs sm:max-w-md">
                    <h4 className="text-stone-800 font-bold text-sm truncate">{art.title}</h4>
                    <p className="text-stone-500 text-xs truncate">{art.summary}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => togglePublic(art.id, art.isPublic)} className={`px-3 py-1 rounded text-xs font-bold ${art.isPublic ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {art.isPublic ? 'Live' : 'Hidden'}
                  </button>
                  <button onClick={() => handleEditClick(art)} className="text-amber-600 bg-amber-50 px-3 py-1 rounded text-xs font-bold">Edit</button>
                  <button onClick={() => handleDelete(art.id)} className="text-red-600 bg-red-50 px-3 py-1 rounded text-xs font-bold">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}