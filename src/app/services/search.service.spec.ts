import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService],
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch search results', () => {
    const dummyResults = [
      { id: 1, name: 'Test Movie 1', media_type: 'movie' },
      { id: 2, name: 'Test Movie 2', media_type: 'movie' },
    ];

    service.search('Test').subscribe((results) => {
      expect(results.length).toBe(2);
      expect(results).toEqual(dummyResults);
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/search/multi?api_key=${service['apiKey']}&query=Test`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ results: dummyResults });
  });

  it('should fetch video source', () => {
    const dummyVideo = {
      results: [{ site: 'YouTube', key: 'dummyKey' }],
    };

    service.getVideoSrc(1, 'movie').subscribe((src) => {
      expect(src).toBe('https://www.youtube.com/embed/dummyKey');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/movie/1/videos?api_key=${service['apiKey']}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyVideo);
  });

  it('should return empty string if no YouTube video is found', () => {
    const dummyVideo = {
      results: [{ site: 'Vimeo', key: 'dummyKey' }],
    };

    service.getVideoSrc(1, 'movie').subscribe((src) => {
      expect(src).toBe('');
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/movie/1/videos?api_key=${service['apiKey']}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyVideo);
  });
});
