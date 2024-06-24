import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent],
})
export class SearchResultsComponent implements OnInit {
  searchResults: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const query = params['q'];
      if (query) {
        this.searchService.search(query).subscribe((results) => {
          this.searchResults = results;
        });
      }
    });
  }

  onResultClick(result: any) {
    this.searchService
      .getVideoSrc(result.id, result.media_type)
      .subscribe((videoSrc) => {
        this.router.navigate(['/video'], { queryParams: { src: videoSrc } });
      });
  }
}
