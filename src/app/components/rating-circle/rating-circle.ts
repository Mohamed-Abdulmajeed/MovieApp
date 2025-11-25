import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-circle',
  imports: [CommonModule],
  template: `
    <div class="rating-circle-container">
      <svg class="rating-circle" viewBox="0 0 100 100">
        <!-- Background circle with fill -->
        <circle cx="50" cy="50" r="45" class="bg-circle"></circle>
        
        <!-- Progress circle -->
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          class="progress-circle"
          [style.stroke-dashoffset]="strokeDashoffset"
          [style.stroke]="getColor()"
        ></circle>

        <!-- Text rotated 90 degrees -->
        <text 
          x="50" 
          y="57" 
          class="rating-text"
          [attr.fill]="getColor()"
          text-anchor="middle"
          dominant-baseline="middle"
          transform="rotate(90 50 50)"
        >
          {{ rating.toFixed(1) }}
        </text>
      </svg>
    </div>
  `,
  styles: [`
    .rating-circle-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rating-circle {
      width: 50px;
      height: 50px;
      transform: rotate(-90deg);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .bg-circle {
      fill: rgba(0, 0, 0, 1);
      stroke: rgba(0, 0, 0, 1);
      stroke-width: 3;
    }

    .progress-circle {
      fill: none;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 283;
      transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease;
    }

    .rating-text {
      font-size: 18px;
      font-weight: bold;
      pointer-events: none;
    }

    :host-context([data-theme="dark"]) .bg-circle {
      fill: rgba(0, 0, 0, 1);
      stroke: rgba(0, 0, 0, 1);
    }
  `]
})
export class RatingCircleComponent {
  @Input() rating: number = 0;
  @Input() maxRating: number = 10;

  get strokeDashoffset(): number {
    const percentage = (this.rating / this.maxRating) * 100;
    const circumference = 283;
    return circumference - (percentage / 100) * circumference;
  }

  getColor(): string {
    const percentage = (this.rating / this.maxRating) * 100;
    if (percentage >= 75) {
      return '#4CAF50'; // Green
    } else if (percentage >= 60) {
      return '#8BC34A'; // Light Green
    } else if (percentage >= 45) {
      return '#FFC107'; // Amber
    } else if (percentage >= 30) {
      return '#FF9800'; // Orange
    } else {
      return '#F44336'; // Red
    }
  }
}
