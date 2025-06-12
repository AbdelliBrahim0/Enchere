import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Enchere';
}
