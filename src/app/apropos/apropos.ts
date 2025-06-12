import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-apropos',
  standalone: true,
  imports: [CommonModule, RouterModule, Footer],
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
}
