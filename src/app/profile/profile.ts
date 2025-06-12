import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Footer } from '../footer/footer';
import { SupabaseService } from '../services/supabase.service';

interface User {
  user_id: string;
  nom_d_utilisateur: string;
  email: string;
  solde: number;
  created_at: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Footer],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error = '';
  isEditing = false;
  editedUser: Partial<User> = {};

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    try {
      this.loading = true;
      console.log('Début du chargement des données utilisateur');
      const { data: user, error } = await this.supabaseService.getUserProfile();
      
      console.log('Données reçues:', { user, error });
      
      if (error) {
        console.error('Erreur lors du chargement:', error);
        throw error;
      }

      if (user) {
        console.log('Utilisateur trouvé:', user);
        this.user = user;
        this.editedUser = { ...user };
      } else {
        console.log('Aucun utilisateur trouvé');
        this.error = 'Impossible de charger les données du profil';
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      this.error = 'Une erreur est survenue lors du chargement du profil';
    } finally {
      this.loading = false;
    }
  }

  startEditing() {
    this.isEditing = true;
    this.editedUser = { ...this.user };
  }

  async updateProfile() {
    if (!this.user) return;

    try {
      const { error } = await this.supabaseService.updateUserProfile(this.user.user_id, {
        nom_d_utilisateur: this.editedUser.nom_d_utilisateur
      });
      
      if (error) {
        throw error;
      }

      this.user = { ...this.user, ...this.editedUser };
      this.isEditing = false;
      this.error = '';
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      this.error = 'Une erreur est survenue lors de la mise à jour du profil';
    }
  }

  cancelEditing() {
    this.isEditing = false;
    this.editedUser = { ...this.user };
    this.error = '';
  }

  async addBetaCoins() {
    if (!this.user) return;

    try {
      const amount = 1000; // Montant fixe pour l'exemple
      const { error } = await this.supabaseService.updateUserBalance(this.user.user_id, amount);
      
      if (error) {
        throw error;
      }

      await this.loadUserData(); // Recharger les données pour avoir le nouveau solde
    } catch (error) {
      console.error('Erreur lors de l\'ajout de BetaCoins:', error);
      this.error = 'Une erreur est survenue lors de l\'ajout de BetaCoins';
    }
  }
}
