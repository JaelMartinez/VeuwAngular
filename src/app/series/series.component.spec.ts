import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SeriesComponent } from './series.component';
import { AuthService } from '../auth.service';
import { MovieService } from '../services/movie.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FavoritesService } from '../favorites.service';
import { HeaderComponent } from '../header/header.component';
import { of } from 'rxjs';

describe('SeriesComponent', () => {
  let component: SeriesComponent;
  let fixture: ComponentFixture<SeriesComponent>;
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
        SeriesComponent,
      ],
      providers: [AuthService, MovieService, FavoritesService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesComponent);
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

  it('should load series on initialization', async () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(movieService, 'getTrendingSeries').and.returnValue(
      Promise.resolve([])
    );
    spyOn(movieService, 'getPopularSeries').and.returnValue(
      Promise.resolve([])
    );
    spyOn(movieService, 'getActionSeries').and.returnValue(Promise.resolve([]));
    spyOn(movieService, 'getComedySeries').and.returnValue(Promise.resolve([]));
    spyOn(movieService, 'getSciFiSeries').and.returnValue(Promise.resolve([]));
    spyOn(movieService, 'getDramaSeries').and.returnValue(Promise.resolve([]));
    spyOn(movieService, 'getAnimeSeries').and.returnValue(Promise.resolve([]));

    await component.loadSeriesAndInitialize();
    expect(component.trendingSeries).toEqual([]);
    expect(component.popularSeries).toEqual([]);
    expect(component.actionSeries).toEqual([]);
    expect(component.comedySeries).toEqual([]);
    expect(component.sciFiSeries).toEqual([]);
    expect(component.dramaSeries).toEqual([]);
    expect(component.animeSeries).toEqual([]);
  });

  it('should handle play button click correctly', (done) => {
    const movieServiceSpy = spyOn(
      movieService,
      'getMovieVideoSrc'
    ).and.returnValue(Promise.resolve('test-video-src'));

    const originalLocation = window.location;
    const mockLocation = { assign: jasmine.createSpy('assign') };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    });

    component
      .handlePlayButtonClick('test-series-id', 'test-media-type')
      .then(() => {
        expect(movieServiceSpy).toHaveBeenCalledWith(
          'test-series-id',
          'test-media-type'
        );
        expect(
          (window.location.assign as jasmine.Spy).calls.mostRecent().args[0]
        ).toBe('/video?src=test-video-src');

        Object.defineProperty(window, 'location', {
          value: originalLocation,
          writable: true,
        });
        done();
      });
  }, 15000);

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
      'test-series-id',
      'test-media-type'
    );
    expect(movieServiceSpy).toHaveBeenCalledWith(
      'test-series-id',
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
