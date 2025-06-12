import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FraisdinscriptionComponent } from '../fraisdinscription/fraisdinscription';
import { SupabaseService } from '../services/supabase.service';

interface Enchere {
  enchere_id: number;
  nom_article: string;
  url_photo_darticle: string;
  description: string;
  categorie: string;
  min_participants: number;
  frais_participation: number;
  date_diffusion: string;
}

@Component({
  selector: 'app-enchere-detailles',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FraisdinscriptionComponent
  ],
  templateUrl: './enchere-detailles.html',
  styleUrls: ['./enchere-detailles.css']
})
export class EnchereDetaillesComponent implements OnInit {
  @Input() enchere: Enchere | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() participate = new EventEmitter<Enchere>();

  isFraisModalOpen = false;
  userBalance = 0;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.loadUserBalance();
  }

  async loadUserBalance() {
    try {
      const { data: user, error } = await this.supabaseService.getUserProfile();
      if (error) throw error;
      if (user) {
        this.userBalance = user.solde;
        console.log('Solde chargé:', this.userBalance);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du solde:', error);
    }
  }

  onClose() {
    this.close.emit();
  }

  onParticipate() {
    this.isFraisModalOpen = true;
  }

  onFraisModalClose() {
    this.isFraisModalOpen = false;
  }

  onFraisModalConfirm() {
    this.isFraisModalOpen = false;
    if (this.enchere) {
      this.participate.emit(this.enchere);
    }
  }

  onBalanceUpdated(newBalance: number) {
    this.userBalance = newBalance;
    console.log('Solde mis à jour:', this.userBalance);
  }

  getTimeRemaining(): string {
    if (!this.enchere?.date_diffusion) return '';
    
    const endDate = new Date(this.enchere.date_diffusion);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Terminé';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }
}
