import { useState, useEffect } from 'react';
import { db } from "../firebase"; 
import { collection, getDocs } from "firebase/firestore";

// Fungsi helper untuk warna badge
const getBadgeColor = (badge) => {
  if (badge === 'Best Seller') return 'bg-amber-500 text-white';
  if (badge === 'Populer') return 'bg-stone-700 text-white';
  if (badge === 'Promo') return 'bg-red-600 text-white';
  return 'bg-stone-500 text-white';
};

// Komponen ProductCard
function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-lg transition-shadow">
      {/* Wrapper gambar untuk posisi badge */}
      <div className="relative mb-4">
        <img src={product.imagePath} alt={product.name} className="w-full h-48 object-cover rounded-xl" />
        {/* Badge di atas gambar */}
        {product.badge && product.badge !== '' && (
          <div className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-bold rounded-lg ${getBadgeColor(product.badge)}`}>
            {product.badge}
          </div>
        )}
      </div>

      <span className="text-[10px] font-bold text-amber-600 uppercase">{product.gradeLabel}</span>
      <h3 className="font-bold text-stone-800 text-lg mb-1">{product.name}</h3>
      <p className="text-stone-500 text-sm mb-4">{product.price}</p>
      <div className="text-stone-600 text-xs text-justify line-clamp-2">{product.desc}</div>
    </div>
  );
}

// Kategori (Harus sama dengan di Admin)
const GRADE_CATEGORIES = ['Semua', 'Grade A', 'Grade B', 'Grade C'];

export default function ProdukKatalog() {
  const [publicProducts, setPublicProducts] = useState([]);
  const [activeGrade, setActiveGrade] = useState('Semua');
  const [loading, setLoading] = useState(true);

  // Ambil data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filtered = data.filter((p) => p.isPublic === true);
        setPublicProducts(filtered);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayedProducts = activeGrade === 'Semua'
    ? publicProducts
    : publicProducts.filter((p) => p.gradeLabel === activeGrade);

  return (
    <div className="w-full bg-stone-50 min-h-screen">
      <section className="bg-gradient-to-br from-stone-800 to-stone-900 py-16 text-center text-white">
        <h1 className="text-4xl font-extrabold">Telur Sehat <span className="text-amber-400">Sinergy</span></h1>
      </section>

      {/* Filter Tabs */}
      <div className="bg-white border-b sticky top-0 z-30 py-4">
        <div className="flex gap-2 justify-center overflow-x-auto px-4">
          {GRADE_CATEGORIES.map((grade) => (
            <button
              key={grade}
              onClick={() => setActiveGrade(grade)}
              className={`px-5 py-2 rounded-full text-sm font-bold ${activeGrade === grade ? 'bg-amber-500 text-stone-900' : 'bg-stone-100'}`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Produk */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-20">Memuat...</div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-stone-500">Belum ada produk.</div>
        )}
      </section>
    </div>
  );
}