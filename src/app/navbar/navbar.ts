import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  isProfileMenuOpen = false;
  hasNotifications = true;
  userProfileImage: string | null = null;

  constructor() {}

  ngOnInit() {
    // Charger l'image de profil de l'utilisateur si disponible
    this.loadUserProfile();
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleNotifications() {
    // Logique pour afficher les notifications
    console.log('Afficher les notifications');
  }

  private loadUserProfile() {
    // Simuler le chargement du profil utilisateur
    // À remplacer par votre logique d'authentification
    this.userProfileImage = null; // Utilisera l'image par défaut
  }

  // Fermer le menu déroulant si on clique en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown')) {
      this.isProfileMenuOpen = false;
    }
  }
}
