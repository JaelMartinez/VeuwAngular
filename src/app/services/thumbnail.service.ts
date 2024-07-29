import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThumbnailService {
  private apiUrl = 'https://localhost:7284/api/thumbnails'; // Cambia esta URL si es necesario

  constructor(private http: HttpClient) {}

  getThumbnails(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
