import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { FavoritesService } from '../favorites.service';
import { Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;
  let renderer: jasmine.SpyObj<Renderer2>;
  let el: jasmine.SpyObj<ElementRef>;

  const mockFavorites = [
    { title: 'Test Title 1', imageSrc: 'test1.jpg', videoSrc: 'test1.mp4' },
    { title: 'Test Title 2', imageSrc: 'test2.jpg', videoSrc: 'test2.mp4' },
  ];

  beforeEach(async () => {
    const favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', [
      'getFavorites',
      'removeFromFavorites',
    ]);
    const rendererSpy = jasmine.createSpyObj('Renderer2', [
      'createElement',
      'addClass',
      'appendChild',
      'listen',
    ]);
    const elSpy = jasmine.createSpyObj('ElementRef', [], {
      nativeElement: { querySelector: () => ({}) },
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, // Importamos RouterTestingModule para las rutas
        FavoritesComponent, // Importamos el componente standalone aquí
        CommonModule,
        HeaderComponent,
      ],
      providers: [
        { provide: FavoritesService, useValue: favoritesServiceSpy },
        { provide: Renderer2, useValue: rendererSpy },
        { provide: ElementRef, useValue: elSpy },
      ],
    }).compileComponents();

    favoritesService = TestBed.inject(
      FavoritesService
    ) as jasmine.SpyObj<FavoritesService>;
    renderer = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>;
    el = TestBed.inject(ElementRef) as jasmine.SpyObj<ElementRef>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    favoritesService.getFavorites.and.returnValue(mockFavorites);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render favorites on initialization', () => {
    expect(favoritesService.getFavorites).toHaveBeenCalled();
    // Aquí puedes agregar más verificaciones si necesitas validar que el DOM se haya actualizado correctamente
  });

  it('should remove a favorite when the remove button is clicked', () => {
    spyOn(component, 'renderFavorites').and.callThrough();

    // Simula un clic en el botón de remover el primer elemento
    const removeButton = fixture.debugElement.query(
      By.css('.remove-fav-button')
    ).nativeElement;
    removeButton.click();

    expect(favoritesService.removeFromFavorites).toHaveBeenCalledWith(
      mockFavorites[0].title
    );
    expect(component.renderFavorites).toHaveBeenCalled();
  });

  it('should navigate to the video URL when the play button is clicked', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { href: '' };

    // Simula un clic en el botón de reproducir el primer elemento
    const playButton = fixture.debugElement.query(
      By.css('.play-button')
    ).nativeElement;
    playButton.click();

    expect(window.location.href).toBe(
      `/video?src=${encodeURIComponent(mockFavorites[0].videoSrc)}`
    );

    // Restaurar window.location
    window.location = originalLocation;
  });
});
