import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { ref, get, set, getDatabase, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBExxcbQeJMDtQ5O9zi8NsxVk0Z8kczPdA",
  authDomain: "movie-app-c1cd5.firebaseapp.com",
  databaseURL: "https://movie-app-c1cd5-default-rtdb.firebaseio.com",
  projectId: "movie-app-c1cd5",
  storageBucket: "movie-app-c1cd5.firebasestorage.app",
  messagingSenderId: "269307264355",
  appId: "1:269307264355:web:fb5a39eb04cbb39048e756",
  measurementId: "G-0B0Z0X5L0J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

@Injectable({
  providedIn: 'root',
})
export class Firebase {

  //! --------------- Register User
  async registerUser(username: string, email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      await sendEmailVerification(userCredential.user);
      await set(ref(database, "users/" + userId), {
        email,
        name: username,
        emailVerified: false,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  //! ----------- Login User
  async loginUser(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await user.reload();

      const userRef = ref(database, 'users/' + user.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        if (!user.emailVerified) {
          return "NotVerified";
        } else {
          await update(userRef, { emailVerified: true });
        }
      }

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //! ----------- Send Verification Email
  async sendVerificationEmail(): Promise<void> {
    if (!auth.currentUser) return;
    return await sendEmailVerification(auth.currentUser);
  }

  //! ----------- Send Password Reset Email
  async sendPasswordReset(email: string): Promise<void> {
    return await sendPasswordResetEmail(auth, email);
  }

  //! ----------- Get User Wishlist from Firebase
  async getUserWishlist(userId: string): Promise<any[]> {
    try {
      const wishlistRef = ref(database, `users/${userId}/wishlist`);
      const snapshot = await get(wishlistRef);
      
      if (snapshot.exists()) {
        const wishlistData = snapshot.val();
        // Convert object to array if it's an object
        if (typeof wishlistData === 'object' && !Array.isArray(wishlistData)) {
          return Object.values(wishlistData);
        }
        return wishlistData || [];
      }
      return [];
    } catch (error) {
      console.log('Error getting wishlist:', error);
      return [];
    }
  }

  //! ----------- Save Wishlist to Firebase
  async saveUserWishlist(userId: string, wishlist: any[]): Promise<boolean> {
    try {
      const wishlistRef = ref(database, `users/${userId}/wishlist`);
      // Convert array to object with movie IDs as keys for better Firebase structure
      const wishlistObj = wishlist.reduce((acc: any, movie: any) => {
        acc[movie.id] = movie;
        return acc;
      }, {});
      
      await set(wishlistRef, Object.keys(wishlistObj).length > 0 ? wishlistObj : null);
      return true;
    } catch (error) {
      console.log('Error saving wishlist:', error);
      return false;
    }
  }

  //! ----------- Add Movie to Wishlist in Firebase
  async addMovieToWishlist(userId: string, movie: any): Promise<boolean> {
    try {
      const movieRef = ref(database, `users/${userId}/wishlist/${movie.id}`);
      await set(movieRef, movie);
      return true;
    } catch (error) {
      console.log('Error adding movie to wishlist:', error);
      return false;
    }
  }

  //! ----------- Remove Movie from Wishlist in Firebase
  async removeMovieFromWishlist(userId: string, movieId: number): Promise<boolean> {
    try {
      const movieRef = ref(database, `users/${userId}/wishlist/${movieId}`);
      await set(movieRef, null);
      return true;
    } catch (error) {
      console.log('Error removing movie from wishlist:', error);
      return false;
    }
  }
}
