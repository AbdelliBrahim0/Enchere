import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { PostgrestError } from '@supabase/supabase-js';
import { MiseConfirme } from '../mise-confirme/mise-confirme';

interface Enchere {
  enchere_id: number;
  nom_article: string;
  frais_participation: number;
}

@Component({
  selector: 'app-formulaire-de-participation',
  standalone: true,
  imports: [CommonModule, FormsModule, MiseConfirme],
  templateUrl: './formulaire-de-participation.html',
  styleUrls: ['./formulaire-de-participation.css']
})
export class FormulaireDeParticipationComponent implements OnInit {
  @Input() isOpen = false;
  @Input() enchere: Enchere | null = null;
  @Input() userBalance = 0;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{enchereId: number, montant: number}>();

  montantMise = 0;
  errorMessage = '';
  showConfirmation = false;
  currentBalance = 0;
  showMiseConfirme = false;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.loadUserBalance();
  }

  async loadUserBalance() {
    try {
      const { data: user, error } = await this.supabaseService.getUserProfile();
      if (error) {
        console.error('Erreur lors du chargement du solde:', error);
        return;
      }
      if (user) {
        this.currentBalance = user.solde;
        console.log('Solde actuel chargé:', this.currentBalance);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du solde:', error);
    }
  }

  onClose() {
    this.close.emit();
    this.showConfirmation = false;
    this.showMiseConfirme = false;
    this.montantMise = 0;
    this.errorMessage = '';
  }

  async onSubmit() {
    if (this.montantMise <= 0) {
      this.errorMessage = 'Le montant doit être supérieur à 0';
      return;
    }

    if (this.montantMise > this.currentBalance) {
      this.errorMessage = 'Le montant ne peut pas dépasser votre solde';
      return;
    }

    try {
      const session = await this.supabaseService.getSession();
      if (!session?.user?.id) {
        this.errorMessage = 'Vous devez être connecté pour participer';
        return;
      }

      if (this.enchere) {
        console.log('Tentative d\'enregistrement de la mise:', {
          enchereId: this.enchere.enchere_id,
          userId: session.user.id,
          mise: this.montantMise,
          soldeActuel: this.currentBalance
        });

        const { data, error } = await this.supabaseService.addParticipantEnchere(
          this.enchere.enchere_id,
          session.user.id,
          this.montantMise
        );

        if (error) {
          console.error('Erreur détaillée lors de l\'enregistrement:', error);
          const pgError = error as PostgrestError;
          if (pgError.code === '23505') {
            this.errorMessage = 'Vous avez déjà participé à cette enchère';
          } else if (pgError.code === '23503') {
            this.errorMessage = 'Erreur de référence: enchère ou utilisateur non trouvé';
          } else {
            this.errorMessage = `Erreur lors de l'enregistrement: ${pgError.message}`;
          }
          return;
        }

        console.log('Mise enregistrée avec succès');
        this.showMiseConfirme = true;
        this.submit.emit({
          enchereId: this.enchere.enchere_id,
          montant: this.montantMise
        });
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      this.errorMessage = 'Une erreur inattendue est survenue. Veuillez réessayer.';
    }
  }

  onMontantChange() {
    this.errorMessage = '';
    if (this.montantMise > this.currentBalance) {
      this.errorMessage = 'Le montant ne peut pas dépasser votre solde';
    }
  }

  onMiseConfirmeClose() {
    this.showMiseConfirme = false;
    this.onClose();
  }
}
