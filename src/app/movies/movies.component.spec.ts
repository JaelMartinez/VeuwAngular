import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MoviesComponent } from './movies.component';
import { AuthService } from '../auth.service';
import { MovieService } from '../services/movie.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FavoritesService } from '../favorites.service';
import { HeaderComponent } from '../header/header.component';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let authService: AuthService;
  let movieService: MovieService;
  let favoritesService: FavoritesService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        HeaderComponent,
        MoviesComponent,
      ],
      providers: [AuthService, MovieService, FavoritesService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    movieService = TestBed.inject(MovieService);
    favoritesService = TestBed.inject(FavoritesService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');
    component.ngOnInit();
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
    spyOn(movieService, 'getActionMovies').and.returnValue(Promise.resolve([]));
    spyOn(movieService, 'getComedyMovies').and.returnValue(Promise.resolve([]));
    spyOn(movieService, 'getSciFiMovies').and.returnValue(Promise.resolve([]));
    spyOn(movieService, 'getDramaMovies').and.returnValue(Promise.resolve([]));

    await component.loadMoviesAndInitialize();
    expect(component.trendingMovies).toEqual([]);
    expect(component.popularMovies).toEqual([]);
    expect(component.actionMovies).toEqual([]);
    expect(component.comedyMovies).toEqual([]);
    expect(component.sciFiMovies).toEqual([]);
    expect(component.dramaMovies).toEqual([]);
  });

  it('should handle play button click correctly', (done) => {
    const movieServiceSpy = spyOn(
      movieService,
      'getMovieVideoSrc'
    ).and.returnValue(Promise.resolve('test-video-src'));

    // Crear un spy para window.location.assign
    const assignSpy = spyOn(window.location, 'assign');

    component
      .handlePlayButtonClick('test-movie-id', 'test-media-type')
      .then(() => {
        expect(movieServiceSpy).toHaveBeenCalledWith(
          'test-movie-id',
          'test-media-type'
        );
        expect(assignSpy).toHaveBeenCalledWith('/video?src=test-video-src');
        done();
      })
      .catch(done.fail);
  }, 15000);

  it('should handle favorite button click correctly', async () => {
    const movieServiceSpy = spyOn(
      movieService,
      'getMovieVideoSrc'
    ).and.returnValue(Promise.resolve('test-video-src'));
    const favoritesServiceSpy = spyOn(favoritesService, 'addToFavorites');

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

  it('should navigate to details on info button click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const button = fixture.nativeElement.querySelector('.info-button');
    if (button) {
      button.click();
      expect(navigateSpy).toHaveBeenCalled();
    }
  });
});
