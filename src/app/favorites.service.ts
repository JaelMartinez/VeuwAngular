import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FavoriteItem } from './favorite-item.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private apiUrl = 'http://localhost:8080/api/favorites';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<FavoriteItem[]> {
    return this.http.get<FavoriteItem[]>(this.apiUrl);
  }

  addToFavorites(
    title: string,
    imageSrc: string,
    videoSrc: string,
    userId: number
  ): Observable<any> {
    const favorite = { title, imageSrc, videoSrc, userId };
    return this.http.post<any>(this.apiUrl, favorite);
  }

  removeFromFavorites(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
