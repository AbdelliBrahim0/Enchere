import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { EnchereDetaillesComponent } from '../enchere-detailles/enchere-detailles';
import { SupabaseService } from '../services/supabase.service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { FraisdinscriptionComponent } from '../fraisdinscription/fraisdinscription';
import { FormulaireDeParticipationComponent } from '../formulaire-de-participation/formulaire-de-participation';

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

interface PaginatedResponse {
  data: Enchere[];
  total: number;
  totalPages: number;
}

@Component({
  selector: 'app-tout-les-enchers',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Footer,
    EnchereDetaillesComponent,
    FraisdinscriptionComponent,
    FormulaireDeParticipationComponent
  ],
  templateUrl: './tout-les-enchers.html',
  styleUrls: ['./tout-les-enchers.css']
})
export class ToutLesEnchersComponent implements OnInit, OnDestroy {
  encheres: Enchere[] = [];
  categories: string[] = ['Toutes'];
  selectedCategory: string = 'Toutes';
  searchTerm: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  private subscription: RealtimeChannel | null = null;

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 6;

  // Modal state
  selectedEnchere: Enchere | null = null;
  isModalOpen: boolean = false;
  isFraisModalOpen: boolean = false;
  isParticipationFormOpen: boolean = false;
  userBalance = 1000; // This should come from your auth service

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadEncheres();
    this.subscription = this.supabaseService.subscribeToEncheres();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async loadEncheres() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await this.supabaseService.getEncheres(this.currentPage);
      this.encheres = response.data;
      this.totalItems = response.total;
      this.totalPages = response.totalPages;
      
      // Extraire les catégories uniques
      const uniqueCategories = [...new Set(response.data.map((e: Enchere) => e.categorie))];
      this.categories = ['Toutes', ...uniqueCategories];
    } catch (error: any) {
      console.error('Erreur lors du chargement des enchères:', error);
      this.error = error.message || 'Une erreur est survenue lors du chargement des enchères. Veuillez réessayer.';
    } finally {
      this.isLoading = false;
    }
  }

  get filteredEncheres(): Enchere[] {
    if (!this.encheres) return [];
    
    return this.encheres.filter(enchere => {
      const matchesCategory = this.selectedCategory === 'Toutes' || enchere.categorie === this.selectedCategory;
      const matchesSearch = this.searchTerm === '' || 
        enchere.nom_article.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        enchere.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  get nextEnchereTime(): string {
    if (!this.encheres || this.encheres.length === 0) return '';

    const now = new Date();
    const nextEnchere = this.encheres
      .filter(e => new Date(e.date_diffusion) > now)
      .sort((a, b) => new Date(a.date_diffusion).getTime() - new Date(b.date_diffusion).getTime())[0];

    if (!nextEnchere) return 'Aucune enchère à venir';

    const diff = new Date(nextEnchere.date_diffusion).getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `Prochaine enchère dans ${days}j ${hours}h ${minutes}m`;
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadEncheres();
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadEncheres();
  }

  async goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      await this.loadEncheres();
    }
  }

  async refreshEncheres() {
    await this.loadEncheres();
  }

  openEnchereDetails(enchere: Enchere) {
    this.selectedEnchere = enchere;
    this.isModalOpen = true;
  }

  closeEnchereDetails() {
    this.isModalOpen = false;
    this.selectedEnchere = null;
  }

  openFraisModal() {
    this.isFraisModalOpen = true;
    this.isModalOpen = false;
  }

  closeFraisModal() {
    this.isFraisModalOpen = false;
  }

  openParticipationForm() {
    this.isParticipationFormOpen = true;
    this.isFraisModalOpen = false;
  }

  closeParticipationForm() {
    this.isParticipationFormOpen = false;
  }

  onParticipate() {
    // This will be implemented when we add the participation form
    console.log('Participating in auction:', this.selectedEnchere);
  }
}
