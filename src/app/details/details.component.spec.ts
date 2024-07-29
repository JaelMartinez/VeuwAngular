import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MovieService } from '../services/movie.service';
import { FavoritesService } from '../favorites.service';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let movieService: jasmine.SpyObj<MovieService>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;

  beforeEach(async () => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', [
      'getMovieOrSeriesDetails',
      'getMovieVideoSrc',
    ]);
    const favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', [
      'addToFavorites',
    ]);

    await TestBed.configureTestingModule({
      imports: [DetailsComponent, RouterTestingModule],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: FavoritesService, useValue: favoritesServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '123', // id
              },
              queryParamMap: {
                get: (key: string) => 'movie', // mediaType
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    favoritesService = TestBed.inject(
      FavoritesService
    ) as jasmine.SpyObj<FavoritesService>;

    movieService.getMovieOrSeriesDetails.and.returnValue(
      Promise.resolve({
        id: '123',
        title: 'Test Movie',
        release_date: '2022-01-01',
        origin_country: ['US'],
        genres: [{ name: 'Action' }],
        runtime: 120,
        overview: 'Test overview',
        backdrop_path: '/test_backdrop.jpg',
        poster_path: '/test_poster.jpg',
      })
    );

    movieService.getMovieVideoSrc.and.returnValue(
      Promise.resolve('https://www.youtube.com/embed/test_video')
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movie details and video source on init', async () => {
    await component.ngOnInit();

    expect(movieService.getMovieOrSeriesDetails).toHaveBeenCalledWith(
      '123',
      'movie'
    );
    expect(movieService.getMovieVideoSrc).toHaveBeenCalledWith('123', 'movie');
    expect(component.data.title).toEqual('Test Movie');
    expect(component.videoSrc).toEqual(
      'https://www.youtube.com/embed/test_video'
    );
  });

  it('should handle play button click', async () => {
    const mockLocation = { ...window.location, href: '' };
    spyOnProperty(window, 'location', 'get').and.returnValue(mockLocation);

    await component.handlePlayButtonClick('123', 'movie');

    expect(movieService.getMovieVideoSrc).toHaveBeenCalledWith('123', 'movie');
    expect(mockLocation.href).toEqual(
      'https://www.youtube.com/embed/test_video'
    );
  });

  it('should handle play button click with error', async () => {
    movieService.getMovieVideoSrc.and.returnValue(Promise.reject('error'));

    const consoleSpy = spyOn(console, 'error');

    await component.handlePlayButtonClick('123', 'movie');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error handling play button click:',
      'error'
    );
  });

  it('should handle add to favorites button click', async () => {
    await component.ngOnInit();
    await component.handleFavoriteButtonClick(
      'Test Movie',
      '/test_poster.jpg',
      '123',
      'movie'
    );

    expect(movieService.getMovieVideoSrc).toHaveBeenCalledWith('123', 'movie');
    expect(favoritesService.addToFavorites).toHaveBeenCalledWith(
      'Test Movie',
      'https://image.tmdb.org/t/p/w500/test_poster.jpg',
      'https://www.youtube.com/embed/test_video'
    );
  });

  it('should handle add to favorites button click with error', async () => {
    movieService.getMovieVideoSrc.and.returnValue(Promise.reject('error'));

    const consoleSpy = spyOn(console, 'error');

    await component.handleFavoriteButtonClick(
      'Test Movie',
      '/test_poster.jpg',
      '123',
      'movie'
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error handling favorite button click:',
      'error'
    );
  });

  it('should handle add to favorites button click with null videoSrc', async () => {
    movieService.getMovieVideoSrc.and.returnValue(Promise.resolve(null));

    const consoleSpy = spyOn(console, 'error');

    await component.handleFavoriteButtonClick(
      'Test Movie',
      '/test_poster.jpg',
      '123',
      'movie'
    );

    expect(consoleSpy).toHaveBeenCalledWith('videoSrc is null');
  });

  it('should display movie details in the template', async () => {
    await component.ngOnInit();
    fixture.detectChanges(); // Detecta los cambios después de cargar los datos

    const titleElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(titleElement.textContent).toContain('Test Movie');

    const overviewElement = fixture.debugElement.query(
      By.css('.leading-relaxed') // Asegúrate de que este selector coincida con el que usas en tu plantilla
    ).nativeElement;
    expect(overviewElement.textContent).toContain('Test overview');
  });

  it('should display error message if movieId or mediaType is missing', async () => {
    component.data = {}; // Reset data
    component.videoSrc = null; // Reset videoSrc

    const consoleSpy = spyOn(console, 'error');

    await component.ngOnInit();
    fixture.detectChanges(); // Detecta los cambios después de cargar los datos

    expect(consoleSpy).toHaveBeenCalled();
  });
});
