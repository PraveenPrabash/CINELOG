import { doc, setDoc, deleteDoc, getDocs, collection, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { WatchedEpisode } from '../../types';

export const episodeRepository = {
  async markEpisodeWatched(uid: string, mediaId: string, episode: WatchedEpisode): Promise<void> {
    // Generate a unique ID for the episode record
    const episodeDocId = `${mediaId}_S${episode.seasonNumber}E${episode.episodeNumber}`;
    const ref = doc(db, `users/${uid}/episodes`, episodeDocId);
    const dataToSave = JSON.parse(JSON.stringify({ ...episode, mediaId }));
    await setDoc(ref, {
      ...dataToSave,
      addedAt: serverTimestamp(),
    });
  },

  async unmarkEpisodeWatched(uid: string, mediaId: string, seasonNumber: number, episodeNumber: number): Promise<void> {
    const episodeDocId = `${mediaId}_S${seasonNumber}E${episodeNumber}`;
    const ref = doc(db, `users/${uid}/episodes`, episodeDocId);
    await deleteDoc(ref);
  },

  async getWatchedEpisodes(uid: string): Promise<any[]> {
    const ref = collection(db, `users/${uid}/episodes`);
    const snapshot = await getDocs(query(ref));
    return snapshot.docs.map(doc => doc.data());
  }
};
