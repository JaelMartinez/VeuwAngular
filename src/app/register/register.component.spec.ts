import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CommonModule,
        RouterModule,
        RouterTestingModule,
        RegisterComponent, // Importar en lugar de declarar
      ],
      providers: [AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register successfully and navigate to login', () => {
    component.username = 'newuser';
    component.password = 'newpassword';
    spyOn(authService, 'register').and.returnValue(true);
    const routerSpy = spyOn(router, 'navigate');
    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should show an error message if username already exists', () => {
    component.username = 'existinguser';
    component.password = 'password';
    spyOn(authService, 'register').and.returnValue(false);
    component.onSubmit();
    expect(component.errorMessage).toBe('Username already exists');
  });
});
