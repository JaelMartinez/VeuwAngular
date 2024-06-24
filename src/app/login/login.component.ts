import { AuthService } from '../auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class LoginComponent {
  username = '';
  password = '';
  remember = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const success = this.authService.login(this.username, this.password);
    if (success) {
      if (this.remember) {
        localStorage.setItem('loggedIn', 'true');
      } else {
        sessionStorage.setItem('loggedIn', 'true');
      }
      this.router.navigate(['/home']);
    } else {
      alert('Invalid username or password');
    }
  }
}
