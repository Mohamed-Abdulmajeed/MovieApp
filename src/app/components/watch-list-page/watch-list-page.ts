import { Component, OnInit, inject } from '@angular/core';
import { WishlistService } from '../../shared/wishlist-service';
import { AlertService } from '../../shared/alert-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-watch-list-page',
  imports: [CommonModule],
  templateUrl: './watch-list-page.html',
  styleUrls: ['./watch-list-page.css'],
})
export class WatchListPage implements OnInit {
  private wishlistService = inject(WishlistService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  wishlistMovies: any[] = [];

  ngOnInit() {
    // Block access if user is not logged in
    if (!this.wishlistService.getCurrentUserId()) {
      this.alertService.error('Please log in first');
      this.router.navigate(['/login']);
      return;
    }
    // Subscribe to wishlist changes
    this.wishlistService.getWishlistObservable().subscribe(movies => {
      this.wishlistMovies = movies;
    });

    // Set initial wishlist
    this.wishlistMovies = this.wishlistService.getWishlist();
  }

  /**
   * Remove movie from wishlist
   */
  async removeFromWishlist(movieId: number): Promise<void> {
    await this.wishlistService.removeFromWishlist(movieId);
  }

  /**
   * Navigate to movie details
   */
  navigateToDetails(movieId: number): void {
    this.router.navigate(['/details', movieId]);
  }

  /**
   * Clear all wishlist
   */
  async clearAllWishlist(): Promise<void> {
    if (confirm('Are you sure you want to clear all wishlist items?')) {
      await this.wishlistService.clearWishlist();
    }
  }
}