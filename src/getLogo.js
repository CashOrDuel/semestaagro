import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getStoredLogo() {
  try {
    const docRef = doc(db, "settings", "website-data");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().logoUrl) {
      return docSnap.data().logoUrl;
    }
  } catch (err) {
    console.error("Gagal ambil logo:", err);
  }
  return null;
}