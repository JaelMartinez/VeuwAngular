import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import { FavoriteItem } from './favorite-item.model';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
    localStorage.clear(); // Limpiar el localStorage antes de cada prueba
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty array if no favorites are stored', () => {
    expect(service.getFavorites()).toEqual([]);
  });

  it('should add a favorite item', () => {
    const favorite: FavoriteItem = {
      title: 'Test Title',
      imageSrc: 'test.jpg',
      videoSrc: 'test.mp4',
    };
    service.addToFavorites(
      favorite.title,
      favorite.imageSrc,
      favorite.videoSrc
    );
    expect(service.getFavorites()).toEqual([favorite]);
  });

  it('should not add duplicate favorite items', () => {
    const favorite: FavoriteItem = {
      title: 'Test Title',
      imageSrc: 'test.jpg',
      videoSrc: 'test.mp4',
    };
    service.addToFavorites(
      favorite.title,
      favorite.imageSrc,
      favorite.videoSrc
    );
    service.addToFavorites(
      favorite.title,
      favorite.imageSrc,
      favorite.videoSrc
    );
    expect(service.getFavorites()).toEqual([favorite]);
  });

  it('should remove a favorite item', () => {
    const favorite: FavoriteItem = {
      title: 'Test Title',
      imageSrc: 'test.jpg',
      videoSrc: 'test.mp4',
    };
    service.addToFavorites(
      favorite.title,
      favorite.imageSrc,
      favorite.videoSrc
    );
    service.removeFromFavorites(favorite.title);
    expect(service.getFavorites()).toEqual([]);
  });
});
