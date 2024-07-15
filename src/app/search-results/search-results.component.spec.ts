import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SearchResultsComponent } from './search-results.component';
import { SearchService } from '../services/search.service';
import { By } from '@angular/platform-browser';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let searchService: SearchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SearchResultsComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ q: 'test' }),
          },
        },
        SearchService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService);

    spyOn(searchService, 'search').and.returnValue(
      of([
        {
          id: 1,
          name: 'Test Movie 1',
          poster_path: '/test1.jpg',
          media_type: 'movie',
        },
        {
          id: 2,
          name: 'Test Movie 2',
          poster_path: '/test2.jpg',
          media_type: 'movie',
        },
      ])
    );
    spyOn(searchService, 'getVideoSrc').and.returnValue(
      of('https://www.youtube.com/embed/testVideo')
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch search results based on query param', () => {
    expect(searchService.search).toHaveBeenCalledWith('test');
    expect(component.searchResults.length).toBe(2);
    expect(component.searchResults[0].name).toBe('Test Movie 1');
    expect(component.searchResults[1].name).toBe('Test Movie 2');
  });

  it('should navigate to video component when result is clicked', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');
    const resultElement = fixture.debugElement.query(
      By.css('.card')
    ).nativeElement;
    resultElement.click();

    expect(searchService.getVideoSrc).toHaveBeenCalledWith(1, 'movie');
    expect(navigateSpy).toHaveBeenCalledWith(['/video'], {
      queryParams: { src: 'https://www.youtube.com/embed/testVideo' },
    });
  });
});
