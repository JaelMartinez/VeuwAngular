import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = 'fb2d03f15107664defbb36663974818b'; // Asegúrate de reemplazar con tu API key

  constructor(private http: HttpClient) {}

  search(query: string): Observable<any> {
    const url = `${this.apiUrl}/search/multi?api_key=${this.apiKey}&query=${query}`;
    return this.http.get(url).pipe(map((response: any) => response.results));
  }

  getVideoSrc(id: number, mediaType: string): Observable<string> {
    const url = `${this.apiUrl}/${mediaType}/${id}/videos?api_key=${this.apiKey}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const video = response.results.find((v: any) => v.site === 'YouTube');
        return video ? `https://www.youtube.com/embed/${video.key}` : '';
      })
    );
  }
}
