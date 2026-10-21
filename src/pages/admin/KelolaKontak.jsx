import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import logoPerusahaan from '../../assets/download.jpg';

const defaultData = {
  waNumber: "6281234567890",
  contactDesc: "Ada pertanyaan? Ingin memesan? Tim Sinergy siap membantu Anda. Cara termudah adalah langsung via WhatsApp.",
  logoUrl: "", 
  faqs: [
    { q: 'Apakah bisa pembelian dalam jumlah besar / grosir?', a: 'Ya! Kami melayani pembelian eceran maupun grosir.' },
    { q: 'Apakah tersedia layanan pengiriman?', a: 'Kami menyediakan layanan pengiriman ke area tertentu.' },
    { q: 'Bagaimana cara memastikan kesegaran telur?', a: 'Seluruh telur kami dikemas dan dikirim maksimal H+2 dari tanggal produksi.' },
  ],
  operationalHours: [
    { day: 'Senin – Jumat', hours: '08.00 – 17.00 WIB' },
    { day: 'Sabtu', hours: '08.00 – 14.00 WIB' },
    { day: 'Minggu & Hari Libur', hours: 'Tutup' },
  ],
  aboutStoryTitle: "Lahirlah dari Visi Pribadi, Tumbuh untuk Bangsa",
  aboutStoryText: "CV Semesta Agro Sinergy berakar dari sebuah kegelisahan <strong>sederhana namun mendalam</strong>: mengapa makanan yang seharusnya menyehatkan justru penuh dengan intervensi kimia?<br><br>Didirikan oleh seorang pengusaha yang memiliki visi kuat dalam bidang ketahanan pangan, perusahaan ini dibangun atas keyakinan bahwa peternakan unggas modern <strong>tidak harus mengorbankan kesehatan konsumen</strong> demi efisiensi produksi.<br><br>Dari awal berdirinya, seluruh proses budidaya di Semesta Agro Sinergy dirancang untuk sepenuhnya <strong>bebas dari intervensi zat kimia</strong> — tidak ada antibiotik pertumbuhan, tidak ada hormon sintetis, dan tidak ada pestisida dalam rantai pakan.<br><br>Hasilnya adalah <strong>Telur Sehat Sinergy</strong> — produk unggulan yang bukan hanya telur, tapi merupakan komitmen nyata terhadap kesehatan keluarga Indonesia."
};

export default function KelolaKontak() {
  const [websiteData, setWebsiteData] = useState(defaultData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "settings", "website-data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWebsiteData({
            waNumber: data.waNumber || defaultData.waNumber,
            contactDesc: data.contactDesc || defaultData.contactDesc,
            logoUrl: data.logoUrl || "",
            faqs: data.faqs || defaultData.faqs,
            operationalHours: data.operationalHours || defaultData.operationalHours,
            aboutStoryTitle: data.aboutStoryTitle || defaultData.aboutStoryTitle,
            aboutStoryText: (data.aboutStoryText && data.aboutStoryText.trim() !== "") 
              ? data.aboutStoryText 
              : defaultData.aboutStoryText,
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data dari Cloud:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (key, value) => {
    setWebsiteData(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Ukuran file terlalu besar! Harap pilih gambar di bawah 1MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = websiteData.faqs.map((faq, i) => i === index ? { ...faq, [field]: value } : faq);
    handleChange('faqs', updatedFaqs);
  };

  const addFaqItem = () => handleChange('faqs', [...websiteData.faqs, { q: '', a: '' }]);
  const removeFaqItem = (index) => handleChange('faqs', websiteData.faqs.filter((_, i) => i !== index));

  const handleHoursChange = (index, field, value) => {
    const updatedHours = websiteData.operationalHours.map((item, i) => i === index ? { ...item, [field]: value } : item);
    handleChange('operationalHours', updatedHours);
  };

  const addHoursItem = () => handleChange('operationalHours', [...websiteData.operationalHours, { day: '', hours: '' }]);
  const removeHoursItem = (index) => handleChange('operationalHours', websiteData.operationalHours.filter((_, i) => i !== index));

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "website-data"), websiteData, { merge: true });
      alert('Seluruh data teks dan logo website berhasil diperbarui di Cloud!');
    } catch (error) {
      alert('Gagal menyimpan ke Cloud: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      <aside className="w-64 bg-stone-900 text-white flex flex-col shrink-0 shadow-xl">
        <div className="p-5 border-b border-stone-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white shrink-0 shadow-sm border border-stone-700">
            <img src={websiteData.logoUrl || logoPerusahaan} alt="Logo CV Semesta" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm leading-tight">CV Semesta</h1>
            <p className="text-amber-500 text-[10px] font-semibold tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🖥️ Beranda Dashboard</Link>
          <Link to="/admin/produk" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🥚 Kelola Grade Produk</Link>
          <Link to="/admin/edukasi" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">📚 Kelola Artikel Edukasi</Link>
          <Link to="/admin/galeri" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🖼️ Kelola Galeri Link</Link>
          <Link to="/admin/website" className="block px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm shadow-md">✍️ Kelola Kata Website</Link>
          <div className="pt-10 border-t border-stone-800 mt-6">
            <Link to="/" className="block px-4 py-2.5 rounded-xl text-stone-400 hover:text-red-400 text-sm font-semibold">⬅️ Keluar</Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <header className="mb-6 border-b border-stone-200 pb-4">
          <h2 className="text-2xl font-extrabold text-stone-800 tracking-tight">Manajemen Teks & Logo Website (Cloud)</h2>
          <p className="text-stone-500 text-sm mt-1">Ubah logo utama, kisah kami, nomor WhatsApp, FAQ, dan jam operasional secara dinamis.</p>
        </header>

        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6 max-w-4xl mb-12">
          
          {/* ── BAGIAN: DRAG & DROP LOGO PERUSAHAAN ── */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-stone-900 font-extrabold text-base text-amber-600">🖼️ Pengaturan Logo Website Utama</h3>
              <p className="text-xs text-stone-600 mt-0.5">Upload logo baru via drag & drop untuk mengubah logo di Navbar dan Footer seluruh halaman.</p>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleLogoChange(e); }}
              className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-6 text-center bg-stone-50 hover:bg-amber-50/30 transition-all cursor-pointer relative group"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              
              {websiteData.logoUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={websiteData.logoUrl}
                    alt="Preview Logo"
                    className="w-20 h-20 object-contain rounded-xl bg-white shadow-sm p-1 border border-stone-200"
                  />
                  <p className="text-xs text-stone-600 font-semibold">
                    Logo aktif tersimpan! Seret gambar lain atau klik untuk mengganti.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold">
                    📁
                  </div>
                  <p className="text-sm font-bold text-stone-700">
                    Seret dan letakkan file logo di sini, atau <span className="text-amber-600 underline">cari file</span>
                  </p>
                  <p className="text-xs text-stone-400">PNG, JPG, atau WEBP (Maksimal 1MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* ── BAGIAN: KISAH KAMI ── */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="border-b pb-2 flex justify-between items-center">
              <div>
                <h3 className="text-stone-900 font-extrabold text-base text-amber-600">📖 Teks "Kisah Kami" (Halaman Tentang)</h3>
                <p className="text-xs text-stone-600 mt-0.5">💡 Blok kata yang ingin ditebalkan lalu klik tombol <strong>B (Bold)</strong> atau tekan <code className="bg-stone-100 text-amber-600 px-1 rounded">Ctrl + B</code>.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const selection = window.getSelection();
                  if (!selection.rangeCount) return;
                  const range = selection.getRangeAt(0);
                  const selectedText = range.toString();
                  if (!selectedText) {
                    alert("Blok/pilih kata di dalam kotak teks terlebih dahulu!");
                    return;
                  }
                  const strongEl = document.createElement('strong');
                  strongEl.textContent = selectedText;
                  range.deleteContents();
                  range.insertNode(strongEl);
                  
                  const editorContent = document.getElementById("editableStoryBox").innerHTML;
                  handleChange('aboutStoryText', editorContent);
                }}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
              >
                <b>B</b> Bold Text
              </button>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Judul Sub-Cerita</label>
              <input type="text" className="w-full text-sm bg-white border border-stone-300 rounded-lg p-2.5 font-bold text-stone-900 focus:outline-amber-500 shadow-sm" value={websiteData.aboutStoryTitle} onChange={(e) => handleChange('aboutStoryTitle', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Isi Paragraf (Kisah Kami)</label>
              <div
                id="editableStoryBox"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onInput={(e) => {
                  handleChange('aboutStoryText', e.currentTarget.innerHTML);
                }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                    e.preventDefault();
                    document.execCommand('bold', false, null);
                    const editorContent = document.getElementById("editableStoryBox").innerHTML;
                    handleChange('aboutStoryText', editorContent);
                  }
                }}
                dangerouslySetInnerHTML={{ __html: websiteData.aboutStoryText }}
                className="w-full min-h-[180px] text-xs bg-white border border-stone-300 rounded-lg p-3 text-stone-900 font-medium leading-relaxed focus:outline-amber-500 shadow-sm overflow-y-auto"
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </div>
          </div>

          {/* ── BAGIAN: KONTAK UTAMA ── */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h3 className="text-stone-900 font-extrabold text-base border-b pb-1 text-amber-600">📞 Integrasi WhatsApp & Teks Kontak</h3>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nomor WhatsApp Admin</label>
              <input type="text" className="w-full text-sm bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-amber-500 font-mono font-bold shadow-sm" value={websiteData.waNumber} onChange={(e) => handleChange('waNumber', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Teks Pengantar Halaman Kontak</label>
              <textarea rows="2" className="w-full text-sm bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 font-medium leading-relaxed focus:outline-amber-500 shadow-sm" value={websiteData.contactDesc} onChange={(e) => handleChange('contactDesc', e.target.value)} />
            </div>
          </div>

          {/* ── BAGIAN: JAM OPERASIONAL ── */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex justify-between items-center border-b pb-1">
              <h3 className="text-stone-900 font-extrabold text-base text-amber-600">⏰ Pengaturan Jam Operasional</h3>
              <button type="button" onClick={addHoursItem} className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">➕ Tambah Hari Kerja</button>
            </div>
            <div className="space-y-3">
              {websiteData.operationalHours.map((item, index) => (
                <div key={index} className="flex gap-4 items-center bg-stone-50 p-3 border border-stone-200 rounded-xl">
                  <div className="w-1/3">
                    <input type="text" className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 font-bold text-stone-900 focus:outline-amber-500 shadow-sm" placeholder="Hari" value={item.day} onChange={(e) => handleHoursChange(index, 'day', e.target.value)} />
                  </div>
                  <div className="w-2/3 flex gap-3 items-center">
                    <input type="text" className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 text-stone-900 font-medium focus:outline-amber-500 shadow-sm" placeholder="Jam Kerja" value={item.hours} onChange={(e) => handleHoursChange(index, 'hours', e.target.value)} />
                    <button type="button" onClick={() => removeHoursItem(index)} className="text-xs text-red-600 hover:text-red-800 font-bold px-2">❌</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── BAGIAN: FAQ ── */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex justify-between items-center border-b pb-1">
              <h3 className="text-stone-900 font-extrabold text-base text-amber-600">❓ Daftar Pertanyaan FAQ</h3>
              <button type="button" onClick={addFaqItem} className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">➕ Tambah FAQ Baru</button>
            </div>
            <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2">
              {websiteData.faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-stone-700 uppercase">Pertanyaan #{index + 1}</span>
                    <button type="button" onClick={() => removeFaqItem(index)} className="text-xs text-red-600 hover:text-red-800 font-bold">❌ Hapus</button>
                  </div>
                  <input type="text" className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 font-bold text-stone-900 focus:outline-amber-500 shadow-sm" placeholder="Masukkan pertanyaan..." value={faq.q} onChange={(e) => handleFaqChange(index, 'q', e.target.value)} />
                  <textarea rows="2" className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 text-stone-900 font-medium focus:outline-amber-500 shadow-sm" placeholder="Masukkan jawaban..." value={faq.a} onChange={(e) => handleFaqChange(index, 'a', e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button type="submit" disabled={isSaving} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 text-sm font-extrabold px-8 py-3 rounded-xl transition-all duration-200 shadow-sm">
              {isSaving ? '⏳ Menyimpan...' : '💾 Simpan Perubahan Website'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}