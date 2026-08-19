<div align="center">

<img src="./trlogo.png" alt="CINELOG Logo" width="200" />
<h1>CINELOG</h1>
<p>Your personal movie and TV series tracker.</p>

CINELOG is a personal movie and TV series tracker that helps you track what you've watched, build your collection, manage your watchlist, rate movies and TV shows, and discover popular and trending titles.

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.0-black.svg)](https://expo.dev/)

</div>

---

## Preview

<img src="./preview.png" alt="CINELOG App Preview" />

## ✨ Features

### 🎬 Movie & TV Tracking
Track movies and TV series you've watched.

### ⭐ Personal Ratings
Give your watched titles personal ratings from 0.0 to 10.0.

### 📚 Collection
See your watched movies and TV series in one organized collection.

### 🔖 Watchlist
Save movies and TV series you want to watch later.

### 🔥 Discovery
Discover popular and trending movies and TV series using TMDB.

### 📊 Personal Statistics
See total watched titles, movies vs TV series, watch time, and top genre.

### 🌙 Dark / Light Theme
Seamless adaptation to your device's visual style, maintaining a premium cinematic aesthetic.

### 🔐 Google Authentication
Secure sign-in with Google.

### ☁️ Cloud Sync
Your personal collection and watchlist are synchronized through Firebase.

## ⚙️ How It Works

1. **Sign In**: Authenticate securely using your Google account.
2. **Search**: Find a movie or TV series you're interested in using the integrated TMDB search.
3. **Open Details**: Tap any poster to view rich metadata, synopsis, and TMDB ratings.
4. **Log & Save**: Add it to your Personal Collection (if watched) or Watchlist (if saving for later).
5. **Rate**: Give watched titles a personal rating.
6. **Track Statistics**: Visit your Home dashboard to view your lifetime watch hours and favorite genres.
7. **Discover**: Browse the "Popular" and "Trending" feeds to find your next favorite film.

## 🛠 Tech Stack

CINELOG is built using modern mobile development technologies:

| Technology | Purpose |
|------------|---------|
| **React Native** | Core framework for building native cross-platform mobile views. |
| **Expo** | Development platform & tooling (SDK 54). |
| **Expo Router** | File-based routing and bottom-tab navigation. |
| **TypeScript** | Strict typing for robust, error-free UI and state management. |
| **Firebase Auth** | Handles secure user authentication (Google Sign-In). |
| **Cloud Firestore** | NoSQL database storing user collections, watchlists, and ratings. |
| **TMDB API** | Fetches global movie and TV series metadata, posters, and trending lists. |
| **EAS Build** | Expo Application Services for remote native cloud compilation. |

## 🏗 Architecture

```mermaid
graph TD
    User([User]) --> App[CINELOG React Native App]
    
    subgraph Data Sources
        App --> TMDB[TMDB API]
        TMDB -.-> Discovery[Movie / TV Metadata & Discovery]
    end
    
    subgraph Firebase Cloud
        App --> Auth[Firebase Authentication]
        App --> DB[Firestore Database]
        DB -.-> Collections[Personal Collection & Watchlist]
    end
```

## 📂 Project Structure

```text
src/
├── app/            # Expo Router screens, layouts, and bottom tabs
├── components/     # Reusable UI components (MediaCards, RatingInput, etc.)
├── context/        # React Context (CinelogContext) for global state management
├── services/       # Firebase configuration and API logic
│   ├── firestore/  # Repositories for handling Firestore operations
│   └── tmdb/       # TMDB API fetching logic
├── constants/      # Theme colors, typography, and styling constants
└── types/          # TypeScript interfaces and models
```

## 🔒 Firebase & Security

User data is strictly scoped to the authenticated user's Firebase UID. 
The Firestore structure is designed as:
- `users/{uid}/media`
- `users/{uid}/watchlist`

**Security Rules:**
Firestore security rules are strictly implemented to ensure users can only read and write their own data:
```javascript
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## 🔑 Environment Variables

To run CINELOG locally, you must provide your own API keys. Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
```

> **Note:** Never commit your actual `.env` file or private credentials to version control. The repository includes a `.env.example` template.

## 🚀 Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/PraveenPrabash/CINELOG.git
cd CINELOG
npm install
```

### 2. Firebase Setup
1. Create a project in the Firebase Console.
2. Register an Android app and download your `google-services.json`, placing it in the root directory.
3. Enable **Google Sign-In** under Authentication providers.
4. Enable **Cloud Firestore** and deploy the rules located in `firestore.rules`.

### 3. Start Development Server

Run the Expo development server:

```bash
npx expo start
```

## 🛠 Validation & Development Commands

CINELOG relies on standard Expo and TypeScript validation tools:

- `npx tsc --noEmit` — Verifies all TypeScript typings across the project without emitting output files.
- `npx expo-doctor` — Diagnoses issues in the project configuration and dependency versions.
- `npx expo install --check` — Validates that installed packages match the required versions for the current Expo SDK.

## 📦 Builds

### Development Build
To compile the native app for testing on a physical Android device or emulator with native modules included:
```bash
eas build --profile development --platform android
```

### Production Build
To create a release-ready production build for Android:
```bash
eas build --profile production --platform android
```

## 🗺 Roadmap

- [ ] Advanced filtering, sorting, and tag management.
- [ ] More detailed watch statistics (e.g., viewing habits over time).
- [ ] Personalized recommendations based on top genres.
- [ ] iOS compilation and release.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🔗 Repository

Official GitHub Repository: [https://github.com/PraveenPrabash/CINELOG](https://github.com/PraveenPrabash/CINELOG)

## 🎬 Attribution

<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" width="100" />

This product uses the TMDB API but is not endorsed or certified by TMDB. All movie/TV metadata, posters, and imagery are provided by TMDB.

---

<div align="center">

### 🎬 CINELOG

**Track what you watch. Discover what comes next.**

Made with React Native, Expo, Firebase & TMDB.

</div>
