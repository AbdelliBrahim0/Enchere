import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer {
  currentYear = new Date().getFullYear();
  
  socialLinks = [
    { icon: 'fa-facebook', url: 'https://facebook.com' },
    { icon: 'fa-twitter', url: 'https://twitter.com' },
    { icon: 'fa-instagram', url: 'https://instagram.com' },
    { icon: 'fa-linkedin', url: 'https://linkedin.com' }
  ];

  quickLinks = [
    { name: 'À Propos', path: '/Apropos' },
    { name: 'Enchères', path: '/encheres' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  legalLinks = [
    { name: 'Conditions d\'utilisation', path: '/conditions' },
    { name: 'Politique de confidentialité', path: '/confidentialite' },
    { name: 'Mentions légales', path: '/mentions-legales' }
  ];
}
