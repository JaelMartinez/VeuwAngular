import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService],
    });
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const mockResponses = {
    trending: {
      results: [{ id: 1, name: 'Test Trending Series', media_type: 'tv' }],
    },
    popular: {
      results: [{ id: 2, name: 'Test Popular Series', media_type: 'tv' }],
    },
    movieDetails: { id: 1, title: 'Test Movie', overview: 'Test Overview' },
    movieVideos: {
      results: [{ site: 'YouTube', type: 'Trailer', key: 'test_key' }],
    },
    emptyVideos: { results: [] },
  };

  it('should fetch trending series', async () => {
    const response = service.getTrendingSeries(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].name).toBe('Test Trending Series');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/trending/tv/day?api_key=${service['apiKey']}&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.trending);

    await response;
  });

  it('should fetch popular series', async () => {
    const response = service.getPopularSeries(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].name).toBe('Test Popular Series');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/tv/popular?api_key=${service['apiKey']}&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.popular);

    await response;
  });

  it('should fetch trending movies', async () => {
    const response = service.getTrendingMovies(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].media_type).toBe('movie');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/trending/movie/day?api_key=${service['apiKey']}&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.trending);

    await response;
  });

  it('should fetch popular movies', async () => {
    const response = service.getPopularMovies(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].media_type).toBe('movie');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/movie/popular?api_key=${service['apiKey']}&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.popular);

    await response;
  });

  it('should fetch anime series', async () => {
    const response = service.getAnimeSeries(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].media_type).toBe('tv');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/discover/tv?api_key=${service['apiKey']}&with_genres=16&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.trending);

    await response;
  });

  it('should fetch action series', async () => {
    const response = service.getActionSeries(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].media_type).toBe('tv');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/discover/tv?api_key=${service['apiKey']}&with_genres=10759&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.trending);

    await response;
  });

  it('should fetch comedy series', async () => {
    const response = service.getComedySeries(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].media_type).toBe('tv');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/discover/tv?api_key=${service['apiKey']}&with_genres=35&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.trending);

    await response;
  });

  it('should fetch sci-fi series', async () => {
    const response = service.getSciFiSeries(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].media_type).toBe('tv');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/discover/tv?api_key=${service['apiKey']}&with_genres=10765&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.trending);

    await response;
  });

  it('should fetch action movies', async () => {
    const response = service.getActionMovies(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].media_type).toBe('movie');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/discover/movie?api_key=${service['apiKey']}&with_genres=28&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.trending);

    await response;
  });

  it('should fetch comedy movies', async () => {
    const response = service.getComedyMovies(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].media_type).toBe('movie');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/discover/movie?api_key=${service['apiKey']}&with_genres=35&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.trending);

    await response;
  });

  it('should fetch sci-fi movies', async () => {
    const response = service.getSciFiMovies(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].media_type).toBe('movie');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/discover/movie?api_key=${service['apiKey']}&with_genres=878&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.trending);

    await response;
  });

  it('should fetch movie or series details', async () => {
    const response = service
      .getMovieOrSeriesDetails('1', 'movie')
      .then((res) => {
        expect(res.id).toBe(1);
        expect(res.title).toBe('Test Movie');
      });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/movie/1?api_key=${service['apiKey']}&language=en-US`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.movieDetails);

    await response;
  });

  it('should fetch movie video source with primary language', async () => {
    const response = service.getMovieVideoSrc('1', 'movie').then((res) => {
      expect(res).toBe('https://www.youtube.com/embed/test_key');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/movie/1/videos?api_key=${service['apiKey']}&language=en-US`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.movieVideos);

    await response;
  });

  it('should fetch movie video source with fallback language', async () => {
    const response = service.getMovieVideoSrc('1', 'movie').then((res) => {
      expect(res).toBe('https://www.youtube.com/embed/test_key');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/movie/1/videos?api_key=${service['apiKey']}&language=en-US`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.emptyVideos);

    const fallbackReq = httpMock.expectOne(
      `${service['apiUrl']}/movie/1/videos?api_key=${service['apiKey']}&language=es-MX`
    );
    expect(fallbackReq.request.method).toBe('GET');
    fallbackReq.flush(mockResponses.movieVideos);

    await response;
  });

  it('should return null if no video source is found', async () => {
    const response = service.getMovieVideoSrc('1', 'movie').then((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/movie/1/videos?api_key=${service['apiKey']}&language=en-US`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.emptyVideos);

    const fallbackReq = httpMock.expectOne(
      `${service['apiUrl']}/movie/1/videos?api_key=${service['apiKey']}&language=es-MX`
    );
    expect(fallbackReq.request.method).toBe('GET');
    fallbackReq.flush(mockResponses.emptyVideos);

    await response;
  });

  it('should fetch drama series', async () => {
    const response = service.getDramaSeries(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].media_type).toBe('tv');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/discover/tv?api_key=${service['apiKey']}&with_genres=18&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.trending);

    await response;
  });

  it('should fetch drama movies', async () => {
    const response = service.getDramaMovies(1).then((res) => {
      expect(res.length).toBe(1);
      expect(res[0].media_type).toBe('movie');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/discover/movie?api_key=${service['apiKey']}&with_genres=18&language=en-US&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses.trending);

    await response;
  });
});
