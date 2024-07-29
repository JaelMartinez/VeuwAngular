import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { FavoritesService } from '../favorites.service';
import { FavoriteItem } from '../favorite-item.model';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent],
})
export class FavoritesComponent implements OnInit {
  favorites: FavoriteItem[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoritesService
      .getFavorites()
      .pipe(
        catchError((error) => {
          console.error('Error loading favorites:', error);
          return of([]);
        })
      )
      .subscribe((favorites) => {
        this.favorites = favorites;
        this.renderFavorites();
      });
  }

  renderFavorites() {
    const favoritesContainer = this.el.nativeElement.querySelector(
      '#favorites-container'
    );

    if (!favoritesContainer) {
      console.error('Favorites container not found');
      return;
    }

    favoritesContainer.innerHTML = '';

    this.favorites.forEach((favorite: FavoriteItem) => {
      const slide = this.renderer.createElement('div');
      this.renderer.addClass(slide, 'new-slide');
      this.renderer.addClass(slide, 'relative');
      this.renderer.addClass(slide, 'overflow-hidden');
      this.renderer.addClass(slide, 'rounded-lg');

      slide.innerHTML = `
        <img src="${favorite.imageSrc}" class="w-full h-full object-cover transition-transform duration-300 ease-in-out" />
        <div class="hover-content absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out">
          <h3 class="text-xl text-white mb-4">${favorite.title}</h3>
          <div class="flex space-x-4">
            <button class="icon-button play-button w-12 h-12" data-video-src="${favorite.videoSrc}">
              <i class="fas fa-play"></i>
            </button>
            <button class="icon-button remove-fav-button w-12 h-12" data-id="${favorite.id}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `;

      this.renderer.listen(
        slide.querySelector('.remove-fav-button'),
        'click',
        (event) => {
          const id = (event.target as HTMLElement).getAttribute('data-id');
          this.favoritesService
            .removeFromFavorites(Number(id))
            .subscribe(() => {
              this.loadFavorites();
            });
        }
      );

      this.renderer.listen(slide.querySelector('.play-button'), 'click', () => {
        window.location.href = `/video?src=${encodeURIComponent(
          favorite.videoSrc
        )}`;
      });

      this.renderer.appendChild(favoritesContainer, slide);
    });
  }
}
