import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper">
      <div *ngFor="let item of [].constructor(count)" class="skeleton-item">
        <div class="skeleton skeleton-poster"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      padding: 20px;
    }

    .skeleton-item {
      animation: pulse 2s infinite;
    }

    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
      border-radius: 8px;
      margin-bottom: 8px;
    }

    .skeleton-poster {
      width: 100%;
      height: 300px;
    }

    .skeleton-title {
      width: 80%;
      height: 16px;
      margin-bottom: 8px;
    }

    .skeleton-text {
      width: 100%;
      height: 12px;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        opacity: 1;
      }
    }

    :host-context([data-theme="dark"]) .skeleton {
      background: linear-gradient(90deg, #404040 25%, #505050 50%, #404040 75%);
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() count: number = 8;
}
