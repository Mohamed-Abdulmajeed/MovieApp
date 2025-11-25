import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.isDarkMode());
  public darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();

  constructor() {
    this.applyTheme(this.isDarkMode());
  }

  /**
   * Check if dark mode is enabled
   */
  isDarkMode(): boolean {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    // Default based on system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    const isDark = !this.isDarkMode();
    localStorage.setItem('darkMode', isDark.toString());
    this.darkModeSubject.next(isDark);
    this.applyTheme(isDark);
  }

  /**
   * Apply theme to document
   */
  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#f0f0f0';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): 'light' | 'dark' {
    return this.isDarkMode() ? 'dark' : 'light';
  }
}
