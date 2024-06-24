import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = 'fb2d03f15107664defbb36663974818b';

  constructor(private http: HttpClient) {}

  async getTrendingSeries(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/trending/tv/day?api_key=${this.apiKey}&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'tv',
    }));
  }

  async getPopularSeries(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/tv/popular?api_key=${this.apiKey}&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'tv',
    }));
  }

  async getTrendingMovies(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/trending/movie/day?api_key=${this.apiKey}&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'movie',
    }));
  }

  async getPopularMovies(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'movie',
    }));
  }

  async getAnimeSeries(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/discover/tv?api_key=${this.apiKey}&with_genres=16&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'tv',
    }));
  }

  async getActionSeries(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/discover/tv?api_key=${this.apiKey}&with_genres=10759&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'tv',
    }));
  }

  async getComedySeries(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/discover/tv?api_key=${this.apiKey}&with_genres=35&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'tv',
    }));
  }

  async getSciFiSeries(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/discover/tv?api_key=${this.apiKey}&with_genres=10765&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'tv',
    }));
  }

  async getActionMovies(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_genres=28&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'movie',
    }));
  }

  async getComedyMovies(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_genres=35&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'movie',
    }));
  }

  async getSciFiMovies(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_genres=878&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'movie',
    }));
  }
  async getMovieVideoSrc(
    movieId: string,
    mediaType: string
  ): Promise<string | null> {
    if (!movieId || !mediaType) {
      console.error('movieId or mediaType is null');
      return null;
    }
    try {
      let response: any = await lastValueFrom(
        this.http.get(
          `${this.apiUrl}/${mediaType}/${movieId}/videos?api_key=${this.apiKey}&language=en-US`
        )
      );
      let youtubeTrailer = response.results.find(
        (video: any) => video.site === 'YouTube' && video.type === 'Trailer'
      );

      if (!youtubeTrailer) {
        response = await lastValueFrom(
          this.http.get(
            `${this.apiUrl}/${mediaType}/${movieId}/videos?api_key=${this.apiKey}&language=es-MX`
          )
        );
        youtubeTrailer = response.results.find(
          (video: any) => video.site === 'YouTube' && video.type === 'Trailer'
        );
      }

      return youtubeTrailer
        ? `https://www.youtube.com/embed/${youtubeTrailer.key}`
        : null;
    } catch (error) {
      console.error('Error fetching video:', error);
      return null;
    }
  }

  async getMovieOrSeriesDetails(id: string, mediaType: string): Promise<any> {
    try {
      const response: any = await lastValueFrom(
        this.http.get(
          `${this.apiUrl}/${mediaType}/${id}?api_key=${this.apiKey}&language=en-US`
        )
      );
      return response;
    } catch (error) {
      console.error('Error fetching movie or series details:', error);
      return null;
    }
  }

  async getDramaSeries(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/discover/tv?api_key=${this.apiKey}&with_genres=18&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'tv',
    }));
  }

  async getDramaMovies(page: number = 1) {
    const response: any = await lastValueFrom(
      this.http.get(
        `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_genres=18&language=en-US&page=${page}`
      )
    );
    return response.results.map((item: any) => ({
      ...item,
      media_type: 'movie',
    }));
  }
}
