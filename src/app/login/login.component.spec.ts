import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CommonModule,
        RouterModule,
        RouterTestingModule,
        LoginComponent, // Importar en lugar de declarar
      ],
      providers: [AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should store session login if remember is false', () => {
    component.username = 'testuser';
    component.password = 'testpassword';
    component.remember = false;
    spyOn(authService, 'login').and.returnValue(true);
    const sessionStorageSpy = spyOn(sessionStorage, 'setItem');
    component.onSubmit();
    expect(sessionStorageSpy).toHaveBeenCalledWith('loggedIn', 'true');
  });

  it('should show an alert on login failure', () => {
    component.username = 'testuser';
    component.password = 'wrongpassword';
    component.remember = false;
    spyOn(authService, 'login').and.returnValue(false);
    spyOn(window, 'alert');
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Invalid username or password');
  });

  it('should login successfully and navigate to home', () => {
    component.username = 'testuser';
    component.password = 'testpassword';
    component.remember = true;
    spyOn(authService, 'login').and.returnValue(true);
    spyOn(localStorage, 'setItem');
    const routerSpy = spyOn(router, 'navigate');
    component.onSubmit();
    expect(localStorage.setItem).toHaveBeenCalledWith('loggedIn', 'true');
    expect(routerSpy).toHaveBeenCalledWith(['/home']);
  });
});
