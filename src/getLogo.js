import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getStoredLogo() {
  try {
    const docRef = doc(db, "settings", "website-data");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("🔥 DATA BERHASIL DIAMBIL DARI FIRESTORE:", docSnap.data());
      if (docSnap.data().logoUrl) {
        return docSnap.data().logoUrl;
      } else {
        console.log("⚠️ PERINGATAN: Dokumen 'settings/website-data' ada, tapi field 'logoUrl' kosong/tidak ditemukan!");
      }
    } else {
      console.log("❌ ERROR: Dokumen 'settings/website-data' tidak ditemukan di database!");
    }
  } catch (err) {
    console.error("Gagal ambil logo:", err);
  }
  return null;
}