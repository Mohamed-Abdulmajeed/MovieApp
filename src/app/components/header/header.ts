import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../shared/language.service';
import { MovieService } from '../../shared/movie-service';
import { WishlistService } from '../../shared/wishlist-service';
import { AlertService } from '../../shared/alert-service';
import { ThemeService } from '../../shared/theme.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  private router = inject(Router);
  public languageService = inject(LanguageService);
  private movieService = inject(MovieService);
  public wishlistService = inject(WishlistService);
  private alertService = inject(AlertService);
  public themeService = inject(ThemeService);

  // List of supported languages (as requested)
  languages = ['en', 'ar', 'fr', 'zh', 'ru', 'de'];

  // Map language codes to display names
  languageNames: { [key: string]: string } = {
    en: 'English',
    ar: 'العربية',
    fr: 'Français',
    zh: '中文',
    ru: 'Русский',
    de: 'Deutsch',
  };

  // User properties
  currentUser: any = null;
  wishlistCount: number = 0;
  isDarkMode: boolean = false;

  ngOnInit() {
    // Load current user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }

    // Subscribe to wishlist count changes
    this.wishlistService.getWishlistCountObservable().subscribe(count => {
      this.wishlistCount = count;
    });

    // Set initial wishlist count
    this.wishlistCount = this.wishlistService.getWishlistCount();

    // Subscribe to theme changes
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Set initial dark mode state
    this.isDarkMode = this.themeService.isDarkMode();
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    // Update WishlistService to clear current user ID
    this.wishlistService.setCurrentUserId(null);
    
    // Clear user data from localStorage
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    
    // Clear wishlist from localStorage and reset count
    await this.wishlistService.clearWishlist();
    this.wishlistCount = 0;
    
    // Navigate to home
    this.router.navigate(['/home']);
  }

  /**
   * Navigate to home page
   */
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  /**
   * Navigate to wishlist page
   */
  navigateToWishlist() {
    // Prevent navigation if user is not logged in
    if (!this.wishlistService.getCurrentUserId()) {
      this.alertService.show('Please log in first');
      return;
    }
    this.router.navigate(['/wishlist']);
  }

  /**
   * Navigate to login page
   */
  navigateToLogin() {
    this.router.navigate(['/login']);
  }


  /**
   * Change the application language
   * Updates language service, localStorage, and reloads now playing movies with new language
   */
  changeLang(lang: string) {
    this.languageService.setLanguage(lang);
    // Reload now playing movies with new language
    this.movieService.setNowPlayingWithLanguage(1, lang);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}

