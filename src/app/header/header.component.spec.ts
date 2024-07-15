import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
        HeaderComponent,
      ],
      providers: [AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct routerLinks', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('nav a');

    // Verifica que realmente sean 4 enlaces dentro del nav
    expect(links.length).toBe(4);

    // Verifica que los routerLinks sean correctos
    const expectedLinks = ['/home', '/series', '/movies', '/favorites'];
    links.forEach((link, index) => {
      expect(link.getAttribute('routerLink')).toBe(expectedLinks[index]);
    });
  });

  it('should navigate to search with query', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'test';
    inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

    expect(navigateSpy).toHaveBeenCalledWith(['/search'], {
      queryParams: { q: 'test' },
    });
  });

  it('should have a dropdown menu', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dropdown = compiled.querySelector('.dropdown');
    expect(dropdown).toBeTruthy();
    const dropdownContent = compiled.querySelector('.dropdown-content');
    expect(dropdownContent).toBeTruthy();
  });
});
