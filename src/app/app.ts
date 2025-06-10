import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';
import { Hero } from './hero/hero';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, Hero],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'EnchereBeta';
}
