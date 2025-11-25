import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const LANGUAGE_KEY = 'language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  // simple language observable (e.g., 'en' or 'ar')
  private _language$ = new BehaviorSubject<string>('en');
  language$ = this._language$.asObservable();

  constructor() {
    // initialize from localStorage if available
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      const lang = saved ? saved : 'en';
      this._language$.next(lang);
      this.applyDirection(lang);
    } catch (e) {
      // ignore localStorage errors (e.g., server-side rendering)
      this._language$.next('en');
      this.applyDirection('en');
    }
  }

  setLanguage(lang: string) {
    this._language$.next(lang);
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
    this.applyDirection(lang);
  }

  getCurrentLanguage(): string {
    return this._language$.getValue();
  }

  private applyDirection(lang: string) {
    try {
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.dir = dir;
      }
    } catch (e) {
      // ignore when document is not available
    }
  }
}
