import { Injectable } from '@angular/core';
import { FavoriteItem } from './favorite-item.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  getFavorites(): FavoriteItem[] {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  addToFavorites(title: string, imageSrc: string, videoSrc: string) {
    const favorites = this.getFavorites();
    const alreadyExists = favorites.some(
      (fav: FavoriteItem) => fav.imageSrc === imageSrc
    );
    if (alreadyExists) {
      alert('This item is already in your favorites');
      return;
    }
    favorites.push({ title, imageSrc, videoSrc });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Added to favorites');
  }

  removeFromFavorites(title: string) {
    let favorites = this.getFavorites();
    favorites = favorites.filter((fav: FavoriteItem) => fav.title !== title);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Removed from favorites');
  }
}
