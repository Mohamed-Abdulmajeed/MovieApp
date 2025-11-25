import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firebase } from '../../shared/firebase';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../shared/alert-service';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule],
  providers: [Firebase, AlertService],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css'],
})
export class RegisterPage { 

  username: string = '';
  emailAddress: string = '';
  Password: string = '';
  confirmPassword: string = '';

  constructor(private firebaseService: Firebase, private router: Router,private alertService: AlertService) {}

  navigateToLogin() {
    this.router.navigateByUrl('login');
  }

  /**
   * Navigate to home page (used by template click handler)
   */
  public navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  async submitRegister() {

    this.firebaseService.registerUser(this.username, this.emailAddress, this.Password)
    .then((success) => {
        if (success) { 
          this.alertService.show('Registration successful! Please verify your email before logging in.');
         this.router.navigateByUrl("login"); 
        }
        else {
          this.alertService.show('Registration failed. Please try again.');
        }
    });

  }
}
