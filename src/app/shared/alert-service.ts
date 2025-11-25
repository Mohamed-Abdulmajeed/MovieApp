import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  alertMessage = new Subject<string>();
  private snackBar = inject(MatSnackBar);

  /**
   * Show success message
   */
  show(message: string, duration: number = 3000): void {
    console.log('✅ Alert Show:', message);
    this.alertMessage.next(message);
    this.displayAlert(message, 'success', duration);
  }

  /**
   * Show error message
   */
  error(message: string, duration: number = 5000): void {
    console.log('❌ Alert Error:', message);
    this.alertMessage.next(message);
    this.displayAlert(message, 'error', duration);
  }

  /**
   * Show warning message
   */
  warning(message: string, duration: number = 4000): void {
    console.log('⚠️ Alert Warning:', message);
    this.alertMessage.next(message);
    this.displayAlert(message, 'warning', duration);
  }

  /**
   * Show info message
   */
  info(message: string, duration: number = 3000): void {
    console.log('ℹ️ Alert Info:', message);
    this.alertMessage.next(message);
    this.displayAlert(message, 'info', duration);
  }

  /**
   * Display custom alert using DOM
   */
  private displayAlert(message: string, type: 'success' | 'error' | 'warning' | 'info', duration: number): void {
    // Remove existing alert if any
    const existing = document.getElementById('custom-alert');
    if (existing) {
      existing.remove();
    }

    // Create alert element
    const alert = document.createElement('div');
    alert.id = 'custom-alert';
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.style.display='none';" class="close-btn">&times;</button>
    `;
    
    // Get color based on type
    const colors = {
      success: '#667eea',
      error: '#ff6b6b',
      warning: '#ffd700',
      info: '#00d4ff'
    };

    // Style the alert
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, ${colors[type]} 0%, ${colors[type]}dd 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 9999;
      font-size: 14px;
      font-weight: 500;
      animation: slideDown 0.3s ease-out;
    `;

    document.body.appendChild(alert);

    // Auto-hide after duration
    setTimeout(() => {
      if (alert.parentElement) {
        alert.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => alert.remove(), 300);
      }
    }, duration);
  }
}
