import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/theme.service';

@Component({
  selector: 'app-back-to-top',
  imports: [CommonModule],
  template: `
    <button 
      class="back-to-top"
      *ngIf="isVisible"
      (click)="scrollToTop()"
      title="Back to Top"
      [class.dark-mode]="isDarkMode"
    >
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  `,
  styles: [`
    .back-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      animation: slideUp 0.3s ease-out;
    }

    .back-to-top:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
    }

    .back-to-top:active {
      transform: translateY(-2px);
    }

    .back-to-top.dark-mode {
      background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
      box-shadow: 0 4px 12px rgba(0, 212, 255, 0.4);
    }

    .back-to-top.dark-mode:hover {
      box-shadow: 0 8px 20px rgba(0, 212, 255, 0.6);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .back-to-top {
        width: 40px;
        height: 40px;
        font-size: 16px;
        bottom: 20px;
        right: 20px;
      }
    }
  `]
})
export class BackToTopComponent implements OnInit {
  isVisible: boolean = false;
  isDarkMode: boolean = false;
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isVisible = window.pageYOffset > 300;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
