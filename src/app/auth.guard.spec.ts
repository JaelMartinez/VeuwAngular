import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: jasmine.createSpy('isLoggedIn'),
          },
        },
      ],
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true for a logged in user', () => {
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(true);
    expect(guard.canActivate()).toBe(true);
  });

  it('should navigate to login for a logged out user', () => {
    const navigateSpy = spyOn(router, 'navigate');
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(false);
    expect(guard.canActivate()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
