import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero';
import { Footer } from '../footer/footer';
import { PointsForts } from "../points-forts/points-forts";

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroComponent, Footer, PointsForts],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class AccueilComponent {
}
