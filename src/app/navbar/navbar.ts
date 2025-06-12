import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService, User } from '../services/supabase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class NavbarComponent implements OnInit {
  isProfileMenuOpen = false;
  isEncheresMenuOpen = false;
  hasNotifications = true;
  isAuthenticated = false;
  isLoading = false;
  errorMessage = '';

  // Login form fields
  email = '';
  password = '';

  // User data
  user: User | null = null;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.checkAuth();
  }

  async checkAuth() {
    try {
      const isAuth = await this.supabaseService.checkAuthentication();
      this.isAuthenticated = isAuth;
      if (isAuth) {
        await this.loadUserProfile();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      this.isAuthenticated = false;
    }
  }

  async login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { data, error } = await this.supabaseService.signIn(this.email, this.password);
      
      if (error) {
        throw error;
      }

      if (data?.user) {
        this.isAuthenticated = true;
        await this.loadUserProfile();
        this.isProfileMenuOpen = false;
        this.email = '';
        this.password = '';
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      this.errorMessage = error.message || 'Erreur lors de la connexion';
      this.isAuthenticated = false;
    } finally {
      this.isLoading = false;
    }
  }

  async logout() {
    try {
      await this.supabaseService.signOut();
      this.isAuthenticated = false;
      this.user = null;
      this.isProfileMenuOpen = false;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (this.isProfileMenuOpen) {
      this.isEncheresMenuOpen = false;
    }
  }

  toggleEncheresMenu(event: Event) {
    event.stopPropagation();
    this.isEncheresMenuOpen = !this.isEncheresMenuOpen;
    if (this.isEncheresMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleNotifications() {
    console.log('Toggle notifications');
  }

  private async loadUserProfile() {
    try {
      const { data: user, error } = await this.supabaseService.getUserProfile();
      if (error) throw error;
      this.user = user;
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      this.user = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown') && !target.closest('.dropdown')) {
      this.isEncheresMenuOpen = false;
      this.isProfileMenuOpen = false;
    }
  }
}
