import { Component, signal, inject, OnInit, HostBinding } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { BackToTopComponent } from './components/back-to-top/back-to-top';
import { ThemeService } from './shared/theme.service';
import { LanguageService } from './shared/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, BackToTopComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('Movie-App');
  private themeService: ThemeService = inject(ThemeService);
  private languageService: LanguageService = inject(LanguageService);

  @HostBinding('dir') dir = 'ltr';
  @HostBinding('class.rtl') isRTL = false;

  showLayout: boolean = true;
  constructor(private router: Router) {
    // Do not force navigation to login on app start. Let the router handle default routes.
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;

      // routes without header/footer
      if (currentRoute.includes('login') || currentRoute.includes('register')) {
        this.showLayout = false;
      } else {
        this.showLayout = true;
      }
    });

    // Ensure home is shown by default on app start when URL is root
    const initialUrl = this.router.url;
    if (!initialUrl || initialUrl === '/' || initialUrl === '') {
      // Navigate to '/home' so the app opens the home page by default
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    // subscribe to language changes to update host bindings immediately
    this.languageService.language$.subscribe((lang) => {
      if (lang === 'ar') {
        this.dir = 'rtl';
        this.isRTL = true;
        try {
          document.documentElement.setAttribute('dir', 'rtl');
        } catch (e) {}
      } else {
        this.dir = 'ltr';
        this.isRTL = false;
        try {
          document.documentElement.setAttribute('dir', 'ltr');
        } catch (e) {}
      }
    });

    // Set initial direction based on stored language and listen to storage events
    const currentLang = localStorage.getItem('language') || 'en';
    if (currentLang === 'ar') {
      this.dir = 'rtl';
      this.isRTL = true;
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      this.dir = 'ltr';
      this.isRTL = false;
      document.documentElement.setAttribute('dir', 'ltr');
    }

    // Listen to language changes via storage events (when other components update localStorage)
    window.addEventListener('storage', (ev: StorageEvent) => {
      if (ev.key === 'language') {
        const lang = (ev.newValue as string) || 'en';
        if (lang === 'ar') {
          this.dir = 'rtl';
          this.isRTL = true;
          document.documentElement.setAttribute('dir', 'rtl');
        } else {
          this.dir = 'ltr';
          this.isRTL = false;
          document.documentElement.setAttribute('dir', 'ltr');
        }
      }
    });
  }

}
