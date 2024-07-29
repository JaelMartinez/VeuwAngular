import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FavoritesService } from '../favorites.service';
import { MovieService } from '../services/movie.service';
import { ThumbnailService } from '../services/thumbnail.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent],
})
export class HomeComponent implements OnInit, AfterViewInit {
  items!: NodeListOf<Element>;
  thumbnails: any[] = []; // Cambiado a any[]
  countItem!: number;
  itemActive: number = 0;
  refreshInterval: any;
  trendingMovies: any[] = [];
  popularMovies: any[] = [];
  animeSeries: any[] = [];
  popularSeries: any[] = [];
  scrollIndex: number = 0;
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = 'fb2d03f15107664defbb36663974818b'; // Asegúrate de reemplazar con tu API key

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private favoritesService: FavoritesService,
    private movieService: MovieService,
    private thumbnailService: ThumbnailService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadMoviesAndInitialize();
  }

  ngAfterViewInit() {
    // No hacemos nada aquí por ahora
  }

  async loadMoviesAndInitialize() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.trendingMovies = await this.fillMoviesArrayWithTrailers('trending');
      this.popularMovies = await this.fillMoviesArrayWithTrailers('popular');
      this.animeSeries = await this.fillMoviesArrayWithTrailers('anime');
      this.popularSeries = await this.fillMoviesArrayWithTrailers(
        'popularSeries'
      );
      this.thumbnails =
        (await this.thumbnailService.getThumbnails().toPromise()) || []; // Asignar siempre un array
      this.cdr.detectChanges();
      this.initializeReferencesAndListeners();
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }

  async fillMoviesArrayWithTrailers(category: string): Promise<any[]> {
    const moviesWithTrailers = [];
    let page = 1;

    while (moviesWithTrailers.length < 12) {
      let movies: any[];

      switch (category) {
        case 'trending':
          movies = await this.movieService.getTrendingMovies(page);
          break;
        case 'popular':
          movies = await this.movieService.getPopularMovies(page);
          break;
        case 'anime':
          movies = await this.movieService.getAnimeSeries(page);
          break;
        case 'popularSeries':
          movies = await this.movieService.getPopularSeries(page);
          break;
        default:
          return [];
      }

      for (const movie of movies) {
        if (moviesWithTrailers.length >= 12) break;
        const videoSrc = await this.movieService.getMovieVideoSrc(
          movie.id,
          movie.media_type
        );
        if (videoSrc) {
          moviesWithTrailers.push(movie);
        }
      }

      page += 1;

      if (movies.length === 0) break; // Break the loop if no more movies are available
    }

    return moviesWithTrailers;
  }

  initializeReferencesAndListeners() {
    this.items = this.el.nativeElement.querySelectorAll('.slider .list .item');
    this.countItem = this.items.length;

    const nextButton = this.el.nativeElement.querySelector('#next');
    const prevButton = this.el.nativeElement.querySelector('#prev');

    if (nextButton) {
      this.renderer.listen(nextButton, 'click', () => this.nextClick());
    }

    if (prevButton) {
      this.renderer.listen(prevButton, 'click', () => this.prevClick());
    }

    this.refreshInterval = setInterval(() => {
      nextButton?.click();
    }, 10000);

    this.toggleHeaderClass();
    window.addEventListener('scroll', this.toggleHeaderClass.bind(this));

    document.addEventListener('click', (e: MouseEvent) => {
      let handle = (e.target as Element).closest('.new-handle');
      if (handle != null) this.onHandleClick(handle);
    });

    const throttleProgressBar = this.throttle(() => {
      this.el.nativeElement
        .querySelectorAll('.new-progress-bar')
        .forEach(this.calculateProgressBar.bind(this));
    }, 250);

    window.addEventListener('resize', throttleProgressBar);
    this.el.nativeElement
      .querySelectorAll('.new-progress-bar')
      .forEach(this.calculateProgressBar.bind(this));

    this.setupPlayButtonListeners();
    this.setupFavoriteButtonListeners();
    this.setupInfoButtonListeners();

    const logoutButton = this.el.nativeElement.querySelector('#logout');
    if (logoutButton) {
      this.renderer.listen(logoutButton, 'click', () => {
        this.authService.logout();
      });
    }

    this.showSlider();
  }

  setupPlayButtonListeners() {
    const playButtons = this.el.nativeElement.querySelectorAll('.play-button');
    playButtons.forEach((button: HTMLElement) => {
      this.renderer.listen(button, 'click', () => {
        const movieId = button.getAttribute('data-movie-id');
        const mediaType = button.getAttribute('data-media-type');
        if (movieId && mediaType) {
          this.handlePlayButtonClick(movieId, mediaType)
            .then()
            .catch((error) => console.error(error));
        }
      });
    });
  }
  setupFavoriteButtonListeners() {
    const favButtons = this.el.nativeElement.querySelectorAll('.fav-button');
    favButtons.forEach((button: HTMLElement) => {
      this.renderer.listen(button, 'click', (event) => {
        const slide = button.closest('.relative');
        if (!slide) {
          console.error('Slide is null');
          return;
        }
        const titleElement =
          slide.querySelector('h3') || slide.querySelector('h1');
        const title = titleElement
          ? titleElement.textContent ?? 'Unknown Title'
          : 'Unknown Title';
        const imageElement = slide.querySelector('img');
        const imageSrc = imageElement ? imageElement.src : '';
        const movieId = slide.getAttribute('data-movie-id');
        const mediaType = slide.getAttribute('data-media-type');

        if (movieId && imageSrc && mediaType) {
          this.handleFavoriteButtonClick(title, imageSrc, movieId, mediaType)
            .then()
            .catch((error) => console.error(error));
        } else {
          console.error('ImageSrc, MovieId or MediaType is null');
        }
      });
    });
  }

  setupInfoButtonListeners() {
    const infoButtons = this.el.nativeElement.querySelectorAll('.info-button');
    infoButtons.forEach((button: HTMLElement) => {
      this.renderer.listen(button, 'click', (event) => {
        const slide = button.closest('.relative');
        const movieId = slide?.getAttribute('data-movie-id');
        const mediaType = slide?.getAttribute('data-media-type');
        if (movieId && mediaType) {
          this.router.navigate(['/details', movieId], {
            queryParams: { mediaType },
          });
        }
      });
    });
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
      const userId = this.authService.getUserId();
      if (videoSrc && userId !== null) {
        this.favoritesService
          .addToFavorites(title, imageSrc, videoSrc, Number(userId))
          .subscribe(
            (response) => {
              console.log('Added to favorites:', response);
            },
            (error) => {
              console.error('Error adding to favorites:', error);
            }
          );
      } else {
        console.error('userId or videoSrc is null', { videoSrc, userId });
      }
    } catch (error) {
      console.error('Error handling favorite button click:', error);
    }
  }

  nextClick() {
    this.itemActive += 1;
    if (this.itemActive >= this.countItem) {
      this.itemActive = 0;
    }
    this.showSlider();
  }

  prevClick() {
    this.itemActive -= 1;
    if (this.itemActive < 0) {
      this.itemActive = this.countItem - 1;
    }
    this.showSlider();
  }

  showSlider() {
    const itemActiveOld = this.el.nativeElement.querySelector(
      '.slider .list .item.active'
    );
    const thumbnailActiveOld = this.el.nativeElement.querySelector(
      '.thumbnail .item.active'
    );
    if (itemActiveOld) this.renderer.removeClass(itemActiveOld, 'active');
    if (thumbnailActiveOld)
      this.renderer.removeClass(thumbnailActiveOld, 'active');

    if (this.items.length > 0 && this.thumbnails.length > 0) {
      this.renderer.addClass(this.items[this.itemActive], 'active');
      this.renderer.addClass(this.thumbnails[this.itemActive], 'active');
    }

    clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => {
      const nextButton = this.el.nativeElement.querySelector('#next');
      if (nextButton) nextButton.click();
    }, 10000);
  }

  toggleHeaderClass() {
    const header = this.el.nativeElement.querySelector('#header');
    if (header) {
      if (window.scrollY > 0) {
        this.renderer.addClass(header, 'bg-gray-950');
      } else {
        this.renderer.removeClass(header, 'bg-gray-950');
      }
    }
  }

  updateScroll() {
    const scrollContainer = this.el.nativeElement.querySelector('.new-slider');
    if (scrollContainer) {
      scrollContainer.style.setProperty(
        '--scroll-index',
        this.scrollIndex.toString()
      );
    }
  }

  onHandleClick(handle: Element) {
    const progressBar = handle
      .closest('.new-row')
      ?.querySelector('.new-progress-bar') as HTMLElement | null;
    const slider = handle
      .closest('.new-container')
      ?.querySelector('.new-slider') as HTMLElement | null;
    const sliderIndex = parseInt(
      getComputedStyle(slider!).getPropertyValue('--slider-index')
    );
    const progressBarItemCount = progressBar?.children.length || 0;

    if (progressBar && slider) {
      if (handle.classList.contains('new-left-handle')) {
        if (sliderIndex - 1 < 0) {
          slider.style.setProperty(
            '--slider-index',
            (progressBarItemCount - 1).toString()
          );
          progressBar.children[sliderIndex].classList.remove('active');
          progressBar.children[progressBarItemCount - 1].classList.add(
            'active'
          );
        } else {
          slider.style.setProperty(
            '--slider-index',
            (sliderIndex - 1).toString()
          );
          progressBar.children[sliderIndex].classList.remove('active');
          progressBar.children[sliderIndex - 1].classList.add('active');
        }
      }

      if (handle.classList.contains('new-right-handle')) {
        if (sliderIndex + 1 >= progressBarItemCount) {
          slider.style.setProperty('--slider-index', '0');
          progressBar.children[sliderIndex].classList.remove('active');
          progressBar.children[0].classList.add('active');
        } else {
          slider.style.setProperty(
            '--slider-index',
            (sliderIndex + 1).toString()
          );
          progressBar.children[sliderIndex].classList.remove('active');
          progressBar.children[sliderIndex + 1].classList.add('active');
        }
      }
    }
  }

  calculateProgressBar(progressBar: HTMLElement) {
    progressBar.innerHTML = '';
    const slider = progressBar
      .closest('.new-row')
      ?.querySelector('.new-slider') as HTMLElement | null;
    if (slider) {
      const itemCount = slider.children.length;
      const itemsPerScreen = parseInt(
        getComputedStyle(slider).getPropertyValue('--items-per-screen')
      );
      let sliderIndex = parseInt(
        getComputedStyle(slider).getPropertyValue('--slider-index')
      );
      const progressBarItemCount = Math.ceil(itemCount / itemsPerScreen);

      if (sliderIndex >= progressBarItemCount) {
        slider.style.setProperty(
          '--slider-index',
          (progressBarItemCount - 1).toString()
        );
        sliderIndex = progressBarItemCount - 1;
      }

      for (let i = 0; i < progressBarItemCount; i++) {
        const barItem = document.createElement('div');
        barItem.classList.add('new-progress-item');
        if (i === sliderIndex) {
          barItem.classList.add('active');
        }
        progressBar.append(barItem);
      }
    }
  }

  throttle(cb: Function, delay = 1000) {
    let shouldWait = false;
    let waitingArgs: any;
    const timeoutFunc = () => {
      if (waitingArgs == null) {
        shouldWait = false;
      } else {
        cb(...waitingArgs);
        waitingArgs = null;
        setTimeout(timeoutFunc, delay);
      }
    };

    return (...args: any[]) => {
      if (shouldWait) {
        waitingArgs = args;
        return;
      }

      cb(...args);
      shouldWait = true;
      setTimeout(timeoutFunc, delay);
    };
  }
}
