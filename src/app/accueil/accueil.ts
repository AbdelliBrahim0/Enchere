import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, HeroComponent, FooterComponent],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class AccueilComponent {
}
