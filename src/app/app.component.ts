import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
  standalone: true,
  imports: [RouterLink, RouterOutlet, HeaderComponent],
})
export class AppComponent {}
