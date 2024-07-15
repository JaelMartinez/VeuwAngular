import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { AuthService } from '../auth.service';
import { MovieService } from '../services/movie.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FavoritesService } from '../favorites.service';
import { HeaderComponent } from '../header/header.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: AuthService;
  let movieService: MovieService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        HeaderComponent,
        HomeComponent,
      ],
      providers: [AuthService, MovieService, FavoritesService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    movieService = TestBed.inject(MovieService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');
    component.loadMoviesAndInitialize();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should load movies on initialization', async () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(movieService, 'getTrendingMovies').and.returnValue(
      Promise.resolve([])
    );
    spyOn(movieService, 'getPopularMovies').and.returnValue(
      Promise.resolve([])
    );
    spyOn(movieService, 'getAnimeSeries').and.returnValue(Promise.resolve([]));
    spyOn(movieService, 'getPopularSeries').and.returnValue(
      Promise.resolve([])
    );

    await component.loadMoviesAndInitialize();
    expect(component.trendingMovies).toEqual([]);
    expect(component.popularMovies).toEqual([]);
    expect(component.animeSeries).toEqual([]);
    expect(component.popularSeries).toEqual([]);
  });
  it('should handle play button click correctly', async () => {
    const movieServiceSpy = spyOn(
      movieService,
      'getMovieVideoSrc'
    ).and.returnValue(Promise.resolve('test-video-src'));

    // Simular redirección utilizando window.location.assign
    const originalLocation = window.location;
    const mockLocation = { assign: jasmine.createSpy('assign') };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    });

    await component.handlePlayButtonClick('test-movie-id', 'test-media-type');
    expect(movieServiceSpy).toHaveBeenCalledWith(
      'test-movie-id',
      'test-media-type'
    );
    expect(
      (window.location.assign as jasmine.Spy).calls.mostRecent().args[0]
    ).toBe('/video?src=test-video-src');

    // Restaurar window.location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('should handle favorite button click correctly', async () => {
    const movieServiceSpy = spyOn(
      movieService,
      'getMovieVideoSrc'
    ).and.returnValue(Promise.resolve('test-video-src'));
    const favoritesServiceSpy = spyOn(
      TestBed.inject(FavoritesService),
      'addToFavorites'
    );
    await component.handleFavoriteButtonClick(
      'test-title',
      'test-image-src',
      'test-movie-id',
      'test-media-type'
    );
    expect(movieServiceSpy).toHaveBeenCalledWith(
      'test-movie-id',
      'test-media-type'
    );
    expect(favoritesServiceSpy).toHaveBeenCalledWith(
      'test-title',
      'test-image-src',
      'test-video-src'
    );
  });

  it('should have a slider and thumbnails', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.slider')).toBeTruthy();
    expect(compiled.querySelector('.thumbnail')).toBeTruthy();
  });

  it('should navigate to details on info button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const button = fixture.nativeElement.querySelector('.info-button');
    if (button) {
      button.click();
      expect(navigateSpy).toHaveBeenCalled();
    }
  });
});
