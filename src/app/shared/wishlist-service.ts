import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firebase } from './firebase';
import { AlertService } from './alert-service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlist: any[] = [];
  private wishlistSubject = new BehaviorSubject<any[]>([]);
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  private firebaseService = inject(Firebase);
  private alertService = inject(AlertService);
  private currentUserId: string | null = null;

  constructor() {
    this.loadWishlist();
    this.loadCurrentUserId();
  }

  /**
   * Load current user ID from localStorage
   */
  private loadCurrentUserId(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserId = user.uid;
      } catch (error) {
        console.log('Error loading user ID:', error);
      }
    }
  }

  /**
   * Update current user ID
   */
  setCurrentUserId(userId: string | null): void {
    this.currentUserId = userId;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  /**
   * Load wishlist from localStorage
   */
  private loadWishlist(): void {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlist = JSON.parse(savedWishlist);
      this.wishlistSubject.next([...this.wishlist]);
      this.wishlistCountSubject.next(this.wishlist.length);
    }
  }

  /**
   * Save wishlist to localStorage and Firebase
   */
  private async saveWishlist(): Promise<void> {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    this.wishlistSubject.next([...this.wishlist]);
    this.wishlistCountSubject.next(this.wishlist.length);

    // Save to Firebase if user is logged in
    if (this.currentUserId) {
      await this.firebaseService.saveUserWishlist(this.currentUserId, this.wishlist);
    }
  }

  /**
   * Add movie to wishlist
   */
  async addToWishlist(movie: any): Promise<void> {
    if (!this.isInWishlist(movie.id)) {
      this.wishlist.push(movie);
      await this.saveWishlist();
      this.alertService.show(`✅ "${movie.title}" added to wishlist successfully`);
    }
  }

  /**
   * Remove movie from wishlist
   */
  async removeFromWishlist(movieId: number): Promise<void> {
    const movie = this.wishlist.find(m => m.id === movieId);
    this.wishlist = this.wishlist.filter(m => m.id !== movieId);
    await this.saveWishlist();
    if (movie) {
      this.alertService.show(`❌ "${movie.title}" removed from wishlist`);
    }
  }

  /**
   * Check if movie is in wishlist
   */
  isInWishlist(movieId: number): boolean {
    return this.wishlist.some(m => m.id === movieId);
  }

  /**
   * Get all movies in wishlist
   */
  getWishlist(): any[] {
    return [...this.wishlist];
  }

  /**
   * Get wishlist as observable
   */
  getWishlistObservable(): Observable<any[]> {
    return this.wishlistSubject.asObservable();
  }

  /**
   * Get wishlist count as observable
   */
  getWishlistCountObservable(): Observable<number> {
    return this.wishlistCountSubject.asObservable();
  }

  /**
   * Get wishlist count
   */
  getWishlistCount(): number {
    return this.wishlist.length;
  }

  /**
   * Clear all wishlist
   */
  async clearWishlist(): Promise<void> {
    this.wishlist = [];
    await this.saveWishlist();
  }

  /**
   * Load wishlist from array (used when loading from Firebase)
   */
  async loadWishlistFromArray(wishlistArray: any[]): Promise<void> {
    this.wishlist = wishlistArray;
    await this.saveWishlist();
  }

  /**
   * Toggle movie in wishlist
   */
  async toggleWishlist(movie: any): Promise<void> {
    if (this.isInWishlist(movie.id)) {
      await this.removeFromWishlist(movie.id);
    } else {
      await this.addToWishlist(movie);
    }
  }
}