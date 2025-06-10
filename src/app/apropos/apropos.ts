import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-apropos',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './apropos.html',
  styleUrl: './apropos.css'
})
export class AproposComponent {
  features = [
    {
      icon: 'fa-gavel',
      title: 'Enchères en Direct',
      description: 'Participez à des enchères en temps réel avec notre système de mise à jour instantanée.'
    },
    {
      icon: 'fa-shield-alt',
      title: 'Sécurité Garantie',
      description: 'Vos transactions sont protégées par notre système de sécurité de pointe.'
    },
    {
      icon: 'fa-coins',
      title: 'BetaCoins',
      description: 'Notre système de monnaie virtuelle pour des transactions fluides et sécurisées.'
    },
    {
      icon: 'fa-users',
      title: 'Communauté Active',
      description: 'Rejoignez une communauté dynamique d\'enchérisseurs passionnés.'
    }
  ];

  team = [
    {
      name: 'Jean Dupont',
      role: 'Fondateur & CEO',
      image: 'assets/team/jean.jpg',
      description: 'Passionné par les enchères depuis plus de 15 ans.'
    },
    {
      name: 'Marie Martin',
      role: 'Directrice Technique',
      image: 'assets/team/marie.jpg',
      description: 'Experte en développement et innovation.'
    },
    {
      name: 'Pierre Durand',
      role: 'Responsable Marketing',
      image: 'assets/team/pierre.jpg',
      description: 'Spécialiste en stratégie digitale.'
    }
  ];
}
