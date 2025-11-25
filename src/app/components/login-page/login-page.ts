import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { Firebase } from '../../shared/firebase';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../shared/alert-service';
import { WishlistService } from '../../shared/wishlist-service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  providers: [Firebase, AlertService],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
})
export class LoginPage {

  emailAddress: string = '';
  Password: string = '';
  emailReset: string = '';
  message: string = '';
  constructor(private firebaseService: Firebase, private router: Router ,private alertService: AlertService, private wishlistService: WishlistService) {}

  async submitLogin() {
    const user = await this.firebaseService.loginUser(this.emailAddress, this.Password);

    if (user === "NotVerified") {
      const modal = new (window as any).bootstrap.Modal(
        document.getElementById('verifyModal')
      );
      modal.show();
      return;
    }

    if (user) {
      // Save user data to localStorage
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || this.emailAddress.split('@')[0]
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));

      // Update WishlistService with current user ID
      this.wishlistService.setCurrentUserId(user.uid);

      // Load user's wishlist from Firebase
      const wishlist = await this.firebaseService.getUserWishlist(user.uid);
      
      // Save wishlist to localStorage and update service
      if (wishlist && wishlist.length > 0) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        await this.wishlistService.loadWishlistFromArray(wishlist);
      } else {
        await this.wishlistService.clearWishlist();
      }

      this.alertService.show('Login successful!');
      this.router.navigateByUrl('home');
    } else {
      this.alertService.show('Login failed. Please check your credentials.');
    }
  }

  navigateToRegister() {
    this.router.navigateByUrl('register');
  }
// !_________________________
  async resendVerification() {
    try {
      await this.firebaseService.sendVerificationEmail();
      this.alertService.show('Verification email sent. Please check your inbox.');
    } catch {
      this.alertService.show('Unable to send verification email.');
    }
  }



// !----------------------------------------
  openForgotPasswordModal() {
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById('forgotPasswordModal')
  );
  modal.show();
}

async confirmResetPassword() {
  if (!this.emailReset) {
    this.alertService.show("Please enter your email.");
    return;
  }

  try {
    await this.firebaseService.sendPasswordReset(this.emailReset);
    this.alertService.show("Password reset email sent. Please check your inbox.");
    // Close modal after sending
    const modal = (window as any).bootstrap.Modal.getInstance(
      document.getElementById('forgotPasswordModal')
    );
    modal.hide();

  } catch (err) {
    this.alertService.show("Unable to send reset email.");
  }
}

}
