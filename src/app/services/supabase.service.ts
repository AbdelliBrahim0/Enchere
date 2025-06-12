import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { PostgrestError } from '@supabase/supabase-js';

export interface User {
  user_id: string;
  nom_d_utilisateur: string;
  email: string;
  solde: number;
}

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

interface EncheresResponse {
  data: Enchere[];
  total: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private cache: { data: any[]; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly ITEMS_PER_PAGE = 6;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  // Authentication methods
  async getSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        return null;
      }
      return session;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      return null;
    }
  }

  async signIn(email: string, password: string) {
    try {
      // Vérifier d'abord si l'utilisateur existe dans la table users
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      if (userData.password !== password) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Si les identifiants sont corrects, créer une session
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { data: null, error };
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  async getUserProfile() {
    try {
      const session = await this.getSession();
      if (!session?.user?.email) {
        console.error('Erreur : Email utilisateur non défini ou session invalide.');
        return { data: null, error: new Error('Non authentifié') };
      }

      const email = session.user.email.trim().toLowerCase();
      const { data, error } = await this.supabase
        .from('users')
        .select('user_id, nom_d_utilisateur, email, solde') // Suppression de la colonne `created_at`
        .eq('email', email)
        .single();

      if (error) {
        console.error('Erreur lors du chargement du profil depuis Supabase:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erreur inattendue lors du chargement du profil:', error);
      return { data: null, error };
    }
  }

  async checkAuthentication(): Promise<boolean> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        return false;
      }
      return !!session;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      return false;
    }
  }

  // Encheres methods
  async getEncheres(page: number = 1): Promise<EncheresResponse> {
    const start = (page - 1) * this.ITEMS_PER_PAGE;
    const end = start + this.ITEMS_PER_PAGE - 1;

    const { data, error, count } = await this.supabase
      .from('enchere')
      .select('*', { count: 'exact' })
      .range(start, end)
      .order('date_diffusion', { ascending: true });

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / this.ITEMS_PER_PAGE);

    return {
      data: data || [],
      total,
      totalPages
    };
  }

  async refreshEncheres(page: number = 1): Promise<void> {
    this.cache = null;
    await this.getEncheres(page);
  }

  subscribeToEncheres() {
    return this.supabase
      .channel('encheres_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'encheres'
        },
        (payload) => {
          console.log('Change received!', payload);
        }
      )
      .subscribe();
  }

  async updateUserBalance(userId: string, amount: number): Promise<{ data: any; error: any }> {
    try {
      // D'abord, vérifier si l'utilisateur existe
      const { data: user, error: checkError } = await this.supabase
        .from('users')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', checkError);
        return { data: null, error: checkError };
      }

      if (!user) {
        return { data: null, error: new Error('Utilisateur non trouvé') };
      }

      // Mettre à jour le solde
      const { data, error } = await this.supabase
        .from('users')
        .update({ solde: amount })
        .eq('user_id', userId)
        .select('user_id, nom_d_utilisateur, email, solde')
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la mise à jour du solde:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du solde:', error);
      return { data: null, error };
    }
  }

  async addParticipantEnchere(enchereId: number, userId: string, mise: number) {
    try {
      console.log('Début de l\'ajout de la participation:', { enchereId, userId, mise });

      // Insérer la participation avec uniquement les colonnes existantes
      const { error } = await this.supabase
        .from('participants_enchere')
        .insert({
          enchere_id: enchereId,
          user_id: userId,
          mise: mise
        });

      if (error) {
        console.error('Erreur détaillée lors de l\'insertion:', error);
        return { data: null, error };
      }

      console.log('Participation ajoutée avec succès');
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return { 
        data: null, 
        error: { message: 'Erreur inattendue lors de l\'enregistrement' } as PostgrestError 
      };
    }
  }

  async checkUserParticipation(enchereId: number, userId: string) {
    const { data, error } = await this.supabase
      .from('participants_enchere')
      .select('*')
      .eq('enchere_id', enchereId)
      .eq('user_id', userId)
      .maybeSingle();
    
    return { data, error };
  }

  async getUserParticipations(userId: string) {
    try {
      console.log('Début de la récupération des participations pour l\'utilisateur:', userId);
      
      // Récupération des participations avec la jointure
      const { data, error } = await this.supabase
        .from('participants_enchere')
        .select(`
          enchere_id,
          mise,
          enchere:enchere_id (
            nom_article,
            url_photo_darticle,
            categorie
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors de la récupération des participations:', error);
        return { data: null, error };
      }

      console.log('Participations récupérées avec succès:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération des participations:', error);
      return { data: null, error };
    }
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update(updates)
        .eq('user_id', userId)
        .select('user_id, nom_d_utilisateur, email, solde')
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return { data: null, error };
    }
  }
}