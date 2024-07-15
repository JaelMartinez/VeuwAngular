import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const username = 'testUser';
    const password = 'testPassword';
    localStorage.setItem('users', JSON.stringify([])); // Clear previous users

    const result = service.register(username, password);
    expect(result).toBeTrue();
  });

  it('should not register a user with an existing username', () => {
    const username = 'existingUser';
    const password = 'testPassword';
    service.register(username, password); // Register the user once

    const result = service.register(username, password);
    expect(result).toBeFalse();
  });

  it('should login a registered user', () => {
    const username = 'loginUser';
    const password = 'loginPassword';
    service.register(username, password);

    const result = service.login(username, password);
    expect(result).toBeTrue();
  });

  it('should not login an unregistered user', () => {
    const username = 'unregisteredUser';
    const password = 'testPassword';

    const result = service.login(username, password);
    expect(result).toBeFalse();
  });

  it('should return loggedIn status correctly', () => {
    expect(service.isLoggedIn()).toBeFalse();
    localStorage.setItem('loggedIn', 'true');
    expect(service.isLoggedIn()).toBeTrue();
    localStorage.removeItem('loggedIn');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should logout the user', () => {
    localStorage.setItem('loggedIn', 'true');
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
  });
});
