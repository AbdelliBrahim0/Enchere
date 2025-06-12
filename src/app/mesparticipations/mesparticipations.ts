import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';
import { PostgrestError } from '@supabase/supabase-js';
import { Footer } from '../footer/footer';

interface Participation {
  enchere_id: number;
  nom_article: string;
  url_photo_darticle: string;
  mise: number;
  categorie: string;
}

@Component({
  selector: 'app-mesparticipations',
  standalone: true,
  imports: [CommonModule, Footer],
  templateUrl: './mesparticipations.html',
  styleUrl: './mesparticipations.css'
})
export class Mesparticipations implements OnInit {
  participations: Participation[] = [];
  loading = true;
  error = '';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadParticipations();
  }

  async loadParticipations() {
    try {
      console.log('Début du chargement des participations');
      const session = await this.supabaseService.getSession();
      
      if (!session?.user?.id) {
        console.log('Aucune session utilisateur trouvée');
        this.error = 'Vous devez être connecté pour voir vos participations';
        this.loading = false;
        return;
      }

      console.log('Session utilisateur trouvée:', session.user.id);
      const { data, error } = await this.supabaseService.getUserParticipations(session.user.id);

      if (error) {
        console.error('Erreur détaillée:', error);
        const pgError = error as PostgrestError;
        this.error = `Erreur lors du chargement: ${pgError.message}`;
        this.loading = false;
        return;
      }

      console.log('Données reçues de Supabase:', data);

      if (!data || data.length === 0) {
        console.log('Aucune participation trouvée');
        this.participations = [];
        this.loading = false;
        return;
      }

      this.participations = data.map((item: any) => {
        console.log('Traitement de l\'item:', item);
        return {
          enchere_id: item.enchere_id,
          nom_article: item.enchere?.nom_article || 'Article inconnu',
          url_photo_darticle: item.enchere?.url_photo_darticle || '',
          mise: item.mise || 0,
          categorie: item.enchere?.categorie || 'Non catégorisé'
        };
      });

      console.log('Participations mappées avec succès:', this.participations);

    } catch (error) {
      console.error('Erreur inattendue:', error);
      this.error = 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.';
    } finally {
      this.loading = false;
    }
  }
}
