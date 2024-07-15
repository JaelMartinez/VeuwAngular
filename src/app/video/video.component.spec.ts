import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { VideoComponent } from './video.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

describe('VideoComponent', () => {
  let component: VideoComponent;
  let fixture: ComponentFixture<VideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HeaderComponent, VideoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ src: 'test-video-url' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set video src from query params', () => {
    const videoPlayer = fixture.nativeElement.querySelector(
      '#video-player'
    ) as HTMLIFrameElement;
    expect(videoPlayer.src).toContain('test-video-url');
  });
});
