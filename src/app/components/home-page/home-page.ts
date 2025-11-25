import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../shared/movie-service';
  // LanguageService removed from constructor to avoid module resolution issues.
import { WishlistService } from '../../shared/wishlist-service';
import { AlertService } from '../../shared/alert-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
})
export class HomePage {
  constructor(public movies: MovieService, public wishlistService: WishlistService, public alertService: AlertService) {
    // Initialize with now playing movies on first page.
    const lang = localStorage.getItem('language') || 'en';
    this.movies.setNowPlayingWithLanguage(1, lang);

    // Load genres on initialization
    this.movies.loadGenres();

    // Subscribe to now playing observable to update total pages
    this.movies.nowPlaying$.subscribe((data: any) => {
      if (data && (data as any).total_pages) {
        this.totalPages = Math.min((data as any).total_pages, 500); // Cap at 500
      }
    });
  }

  private router = inject(Router);

  // Pagination tracking
  currentPage: number = 1;
  totalPages: number = 5; // Default, will be updated based on API response
  searchQuery: string = '';
  isSearching: boolean = false;

  // Filtering and sorting
  isFiltering: boolean = false;
  selectedGenres: number[] = [];
  selectedSortBy: string = 'popularity.desc';
  minRating: number = 0;

  // Sort options
  sortOptions = [
    { label: 'Popularity (Descending)', value: 'popularity.desc' },
    { label: 'Rating (Descending)', value: 'vote_average.desc' },
    { label: 'Release Date (Newest)', value: 'release_date.desc' },
  ];

  /**
   * Load now playing movies for a specific page
   */
  loadNowPlaying(page: number) {
    this.currentPage = page;
    this.isSearching = false;
    this.isFiltering = false;
    this.searchQuery = '';
    this.selectedGenres = [];
    this.minRating = 0;
    // Load now playing in the currently selected language
  const lang = localStorage.getItem('language') || 'en';
    this.movies.setNowPlayingWithLanguage(page, lang);
    
    // Subscribe to update total pages
    this.movies.nowPlaying$.subscribe(data => {
      if (data && data.total_pages) {
        this.totalPages = Math.min(data.total_pages, 500);
      }
    });
  }

  /**
   * Apply filters and sorting
   */
  applyFiltersAndSort() {
    this.isFiltering = true;
    this.isSearching = false;
    this.currentPage = 1;
  const lang = localStorage.getItem('language') || 'en';
    this.movies.setDiscoverMovies(
      1,
      lang,
      this.selectedSortBy,
      this.selectedGenres.length > 0 ? this.selectedGenres : undefined,
      this.minRating > 0 ? this.minRating : undefined
    );
    
    // Subscribe to update total pages for filtered results
    this.movies.filteredMovies$.subscribe(data => {
      if (data && data.total_pages) {
        this.totalPages = Math.min(data.total_pages, 500);
      }
    });
  }

  /**
   * Toggle genre selection
   */
  toggleGenre(genreId: number) {
    const index = this.selectedGenres.indexOf(genreId);
    if (index > -1) {
      this.selectedGenres.splice(index, 1);
    } else {
      this.selectedGenres.push(genreId);
    }
    this.applyFiltersAndSort();
  }

  /**
   * Change sort option
   */
  changeSortBy(sortBy: string) {
    this.selectedSortBy = sortBy;
    this.applyFiltersAndSort();
  }

  /**
   * Change minimum rating filter
   */
  changeMinRating(rating: number) {
    this.minRating = rating;
    this.applyFiltersAndSort();
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.selectedGenres = [];
    this.selectedSortBy = 'popularity.desc';
    this.minRating = 0;
    this.isFiltering = false;
    this.loadNowPlaying(1);
  }

  /**
   * Search movies by name
   */
  searchMovies(name: string) {
    if (name.trim()) {
      this.searchQuery = name;
      this.isSearching = true;
      this.isFiltering = false;
      this.currentPage = 1;
      this.movies.setAllMovieByName(name);
      
      // Subscribe to update total pages for search results
      this.movies.AllMovieByName$.subscribe(data => {
        if (data && data.total_pages) {
          this.totalPages = Math.min(data.total_pages, 500);
        }
      });
    }
  }

  /**
   * Clear search and return to now playing
   */
  clearSearch() {
    this.searchQuery = '';
    this.isSearching = false;
    this.currentPage = 1;
  const lang = localStorage.getItem('language') || 'en';
    this.movies.setNowPlayingWithLanguage(1, lang);
  }

  /**
   * Get array of page numbers to display (max 10 pages at a time)
   */
  getPageNumbers(): number[] {
    const maxPagesToShow = 10;
    const pages: number[] = [];
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * Navigate to specific page
   */
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if (this.isSearching) {
        this.movies.setAllMovieByName(this.searchQuery);
      } else if (this.isFiltering) {
  const lang = localStorage.getItem('language') || 'en';
        this.movies.setDiscoverMovies(
          page,
          lang,
          this.selectedSortBy,
          this.selectedGenres.length > 0 ? this.selectedGenres : undefined,
          this.minRating > 0 ? this.minRating : undefined
        );
      } else {
        this.loadNowPlaying(page);
      }
    }
  }

  /**
   * Navigate to movie details page
   */
  navigateToDetails(movieId: number) {
    this.router.navigate(['/details', movieId]);
  }

  /**
   * Get next page
   */
  nextPage() {
    if (this.isSearching) {
      this.currentPage++;
      this.movies.setAllMovieByName(this.searchQuery);
    } else if (this.isFiltering) {
      this.currentPage++;
  const lang = localStorage.getItem('language') || 'en';
      this.movies.setDiscoverMovies(
        this.currentPage,
        lang,
        this.selectedSortBy,
        this.selectedGenres.length > 0 ? this.selectedGenres : undefined,
        this.minRating > 0 ? this.minRating : undefined
      );
    } else {
      this.loadNowPlaying(this.currentPage + 1);
    }
  }

  /**
   * Get previous page
   */
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.isSearching) {
        this.movies.setAllMovieByName(this.searchQuery);
      } else if (this.isFiltering) {
  const lang = localStorage.getItem('language') || 'en';
        this.movies.setDiscoverMovies(
          this.currentPage,
          lang,
          this.selectedSortBy,
          this.selectedGenres.length > 0 ? this.selectedGenres : undefined,
          this.minRating > 0 ? this.minRating : undefined
        );
      } else {
        this.loadNowPlaying(this.currentPage);
      }
    }
  }

  /**
   * Toggle wishlist for a movie
   */
  async toggleWishlist(movie: any): Promise<void> {
    // Require login before allowing wishlist changes
    if (!this.wishlistService.getCurrentUserId()) {
      this.alertService.show('Please log in first');
      return;
    }

    if (this.wishlistService.isInWishlist(movie.id)) {
      await this.wishlistService.removeFromWishlist(movie.id);
    } else {
      await this.wishlistService.addToWishlist(movie);
    }
  }

  /**
   * Check if movie is in wishlist
   */
  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
  }
}
