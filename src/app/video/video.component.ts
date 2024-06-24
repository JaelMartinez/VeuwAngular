import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent],
})
export class VideoComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const videoSrc = params['src'];
      if (videoSrc) {
        const videoPlayer = document.getElementById(
          'video-player'
        ) as HTMLIFrameElement;
        videoPlayer.src = videoSrc;
      }
    });
  }
}
