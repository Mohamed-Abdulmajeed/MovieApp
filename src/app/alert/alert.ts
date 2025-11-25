import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../shared/alert-service';

declare var bootstrap: any;

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Simple bootstrap modal used by AlertService -->
    <div class="modal fade" id="customAlert" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="alert-content">
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .alert-content {
        font-size: 14px;
        text-align: center;
      }
    `,
  ],
})
export class Alert {
  message: string = '';

  constructor(private alertService: AlertService) {
    // Listen for message
    this.alertService.alertMessage.subscribe((msg: string) => {
      this.message = msg;
      // Wait for DOM then show
      setTimeout(() => this.openModal(), 50);
    });
  }

  openModal() {
    try {
      const el = document.getElementById('customAlert');
      if (!el) return;
      const modal = new (window as any).bootstrap.Modal(el);
      modal.show();
    } catch (e) {
      // If bootstrap not available, fallback to alert()
      // (never throw from UI service)
      // console.warn('Bootstrap modal not available, falling back to alert');
      alert(this.message);
    }
  }
}
