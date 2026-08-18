import { doc, setDoc, deleteDoc, getDoc, getDocs, collection, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { BaseMedia } from '../../types';

export const watchlistRepository = {
  async addToWatchlist(uid: string, media: BaseMedia): Promise<void> {
    const ref = doc(db, `users/${uid}/watchlist`, media.id.toString());
    await setDoc(ref, {
      ...media,
      addedAt: serverTimestamp(),
    });
  },

  async removeFromWatchlist(uid: string, mediaId: string): Promise<void> {
    const ref = doc(db, `users/${uid}/watchlist`, mediaId);
    await deleteDoc(ref);
  },

  async getWatchlist(uid: string): Promise<any[]> {
    const ref = collection(db, `users/${uid}/watchlist`);
    const snapshot = await getDocs(query(ref));
    return snapshot.docs.map(doc => doc.data());
  }
};
