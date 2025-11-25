import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../shared/movie-service';
import { WishlistService } from '../../shared/wishlist-service';
import { AlertService } from '../../shared/alert-service';
import { CommonModule } from '@angular/common';
import { IVideo, IVideoResponse } from '../../models/ivideo';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RatingCircleComponent } from '../rating-circle/rating-circle';

@Component({
  selector: 'app-details-page',
  imports: [CommonModule, RatingCircleComponent],
  templateUrl: './details-page.html',
  styleUrls: ['./details-page.css'],
})
export class DetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public movies = inject(MovieService);
  private sanitizer = inject(DomSanitizer);
  public wishlistService = inject(WishlistService);
  private alertService = inject(AlertService);

  movieId: number = 0;
  officialTrailer: IVideo | null = null;
  trailerUrl: SafeResourceUrl | null = null;
  allVideos: IVideo[] = [];
  loadingTrailer: boolean = false;

  ngOnInit() {
    // Get the movie ID from the route parameters
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.movieId = id ? parseInt(id, 10) : 0;
      if (this.movieId) {
        // Load movie details for the selected movie
        this.movies.setmovieDetails(this.movieId);
        // Load recommendations for the selected movie
        this.movies.setMovieRecommendation(this.movieId);
        // Load videos/trailers
        this.loadTrailers();
      }
    });
  }

  /**
   * Load movie trailers from API
   */
  loadTrailers() {
    this.loadingTrailer = true;
    this.movies.getMovieVideos(this.movieId).subscribe({
      next: (response: IVideoResponse) => {
        if (response && response.results && response.results.length > 0) {
          this.allVideos = response.results;
          // Find official trailer (prefer Official = true and type = Trailer)
          let trailer = response.results.find(
            (v: IVideo) => v.type === 'Trailer' && v.official && v.site === 'YouTube'
          );
          // Fallback to any trailer
          if (!trailer) {
            trailer = response.results.find(
              (v: IVideo) => v.type === 'Trailer' && v.site === 'YouTube'
            );
          }
          if (trailer) {
            this.officialTrailer = trailer;
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0`
            );
          }
        }
        this.loadingTrailer = false;
      },
      error: (err: any) => {
        console.error('Error loading trailers:', err);
        this.loadingTrailer = false;
      },
    });
  }

  /**
   * Navigate to another movie's details page
   */
  navigateToMovie(movieId: number) {
    this.router.navigate(['/details', movieId]);
  }

  /**
   * Toggle wishlist for the current movie (Details page)
   */
  async onToggleWishlist(movie: any) {
    if (!this.wishlistService.getCurrentUserId()) {
      this.alertService.show('Please log in first');
      return;
    }

    await this.wishlistService.toggleWishlist(movie);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
  }

  /**
   * Go back to the previous page
   */
  goBack() {
    this.router.navigate(['/home']);
  }
}
