import { doc, setDoc, deleteDoc, getDoc, getDocs, collection, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { BaseMedia } from '../../types';

export const mediaRepository = {
  async addMedia(uid: string, media: BaseMedia, myRating: number): Promise<void> {
    const mediaRef = doc(db, `users/${uid}/media`, media.id.toString());
    await setDoc(mediaRef, {
      ...media,
      myRating,
      addedAt: serverTimestamp(),
    });
  },

  async removeMedia(uid: string, mediaId: string): Promise<void> {
    const mediaRef = doc(db, `users/${uid}/media`, mediaId);
    await deleteDoc(mediaRef);
  },

  async getMedia(uid: string, mediaId: string): Promise<any> {
    const mediaRef = doc(db, `users/${uid}/media`, mediaId);
    const snapshot = await getDoc(mediaRef);
    return snapshot.exists() ? snapshot.data() : null;
  },

  async getAllMedia(uid: string): Promise<any[]> {
    const mediaRef = collection(db, `users/${uid}/media`);
    const snapshot = await getDocs(query(mediaRef));
    return snapshot.docs.map(doc => doc.data());
  }
};
