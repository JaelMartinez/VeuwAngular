import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: { username: string; password: string }[] =
    JSON.parse(localStorage.getItem('users')!) || [];

  register(username: string, password: string): boolean {
    const userExists = this.users.find((user) => user.username === username);

    if (userExists) {
      return false;
    }

    this.users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(
      (user) => user.username === username && user.password === password
    );
    return !!user;
  }

  isLoggedIn(): boolean {
    return (
      !!localStorage.getItem('loggedIn') || !!sessionStorage.getItem('loggedIn')
    );
  }

  logout() {
    localStorage.removeItem('loggedIn');
    sessionStorage.removeItem('loggedIn');
  }
}
