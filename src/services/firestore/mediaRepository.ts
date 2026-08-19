import { doc, setDoc, deleteDoc, getDoc, getDocs, collection, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { BaseMedia } from '../../types';

export const mediaRepository = {
  async addMedia(uid: string, media: BaseMedia, rating?: number): Promise<void> {
    const mediaRef = doc(db, `users/${uid}/media`, media.id.toString());
    const dataToSave: any = { ...media };
    
    if (rating !== undefined) {
      dataToSave.rating = rating;
      dataToSave.myRating = rating; // Store both for absolute backward compatibility
    }

    const cleanData = JSON.parse(JSON.stringify(dataToSave));
    await setDoc(mediaRef, {
      ...cleanData,
      addedAt: serverTimestamp(),
    }, { merge: true }); // Use merge to prevent overwriting other fields accidentally
  },

  async removeMedia(uid: string, mediaId: string): Promise<void> {
    const mediaRef = doc(db, `users/${uid}/media`, mediaId);
    await deleteDoc(mediaRef);
  },

  async getMedia(uid: string, mediaId: string): Promise<any> {
    const mediaRef = doc(db, `users/${uid}/media`, mediaId);
    const snapshot = await getDoc(mediaRef);
    if (!snapshot.exists()) return null;
    
    return this._transformMediaData(snapshot.data());
  },

  async getAllMedia(uid: string): Promise<any[]> {
    const mediaRef = collection(db, `users/${uid}/media`);
    const snapshot = await getDocs(query(mediaRef));
    return snapshot.docs.map(doc => this._transformMediaData(doc.data()));
  },

  _transformMediaData(data: any): any {
    // Preserve existing valid ratings
    if (data.rating === undefined && data.myRating !== undefined) {
      data.rating = data.myRating;
    }
    
    // Ensure dateAdded is populated for local sorting
    if (data.addedAt) {
      data.dateAdded = typeof data.addedAt.toMillis === 'function' 
        ? data.addedAt.toMillis() 
        : data.addedAt;
    } else if (!data.dateAdded) {
      data.dateAdded = Date.now();
    }
    
    return data;
  }
};
