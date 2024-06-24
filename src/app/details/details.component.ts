import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { FavoritesService } from '../favorites.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent],
})
export class DetailsComponent implements OnInit {
  data: any = {};
  videoSrc: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private favoritesService: FavoritesService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const mediaType = this.route.snapshot.queryParamMap.get('mediaType');
    if (id && mediaType) {
      this.data = await this.movieService.getMovieOrSeriesDetails(
        id,
        mediaType
      );
      this.videoSrc = await this.movieService.getMovieVideoSrc(id, mediaType);
      this.data.media_type = mediaType; // Añade media_type a data para asegurarse de que esté disponible
    }
  }

  getGenres(genres: any[]): string {
    return genres ? genres.map((genre) => genre.name).join(', ') : '';
  }

  async handlePlayButtonClick(movieId: string, mediaType: string) {
    try {
      const videoSrc = await this.movieService.getMovieVideoSrc(
        movieId,
        mediaType
      );
      if (videoSrc) {
        window.location.href = `/video?src=${encodeURIComponent(videoSrc)}`;
      } else {
        console.error('videoSrc is null');
      }
    } catch (error) {
      console.error('Error handling play button click:', error);
    }
  }
  async handleFavoriteButtonClick(
    title: string,
    imageSrc: string,
    movieId: string,
    mediaType: string
  ) {
    try {
      const videoSrc = await this.movieService.getMovieVideoSrc(
        movieId,
        mediaType
      );
      if (videoSrc) {
        const fullImageSrc = `https://image.tmdb.org/t/p/w500${imageSrc}`;
        this.favoritesService.addToFavorites(title, fullImageSrc, videoSrc);
        console.log('Added to favorites:', { title, fullImageSrc, videoSrc });
      } else {
        console.error('videoSrc is null');
      }
    } catch (error) {
      console.error('Error handling favorite button click:', error);
    }
  }
}
