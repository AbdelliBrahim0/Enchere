import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulaireDeParticipationComponent } from '../formulaire-de-participation/formulaire-de-participation';
import { SupabaseService } from '../services/supabase.service';

interface Enchere {
  enchere_id: number;
  nom_article: string;
  frais_participation: number;
}

@Component({
  selector: 'app-fraisdinscription',
  standalone: true,
  imports: [CommonModule, FormulaireDeParticipationComponent],
  templateUrl: './fraisdinscription.html',
  styleUrls: ['./fraisdinscription.css']
})
export class FraisdinscriptionComponent {
  @Input() isOpen = false;
  @Input() fraisParticipation = 0;
  @Input() enchere: Enchere | null = null;
  @Input() userBalance = 0;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() balanceUpdated = new EventEmitter<number>();

  isParticipationFormOpen = false;
  showConfirmation = false;

  constructor(private supabaseService: SupabaseService) {}

  onClose() {
    this.close.emit();
    this.showConfirmation = false;
  }

  onConfirm() {
    // Afficher le message de confirmation
    this.showConfirmation = true;
    
    // Émettre l'événement de mise à jour du solde
    const newBalance = this.userBalance - this.fraisParticipation;
    this.balanceUpdated.emit(newBalance);
  }

  onContinue() {
    // Passer au formulaire de participation
    this.isParticipationFormOpen = true;
  }

  onParticipationFormClose() {
    this.isParticipationFormOpen = false;
    this.close.emit();
  }

  onParticipationSubmit(data: {enchereId: number, montant: number}) {
    this.isParticipationFormOpen = false;
    this.confirm.emit();
  }
}
