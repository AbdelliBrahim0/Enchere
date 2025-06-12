import { Routes } from '@angular/router';
import { ToutLesEnchersComponent } from './tout-les-enchers/tout-les-enchers';

export const routes: Routes = [
  { path: '', redirectTo: '/Accueil', pathMatch: 'full' },
  { path: 'Accueil', loadComponent: () => import('./accueil/accueil').then(m => m.AccueilComponent) },
  { path: 'Apropos', loadComponent: () => import('./apropos/apropos').then(m => m.AproposComponent) },
  { path: 'faq', loadComponent: () => import('./faq/faq').then(m => m.FaqComponent) },
  { path: 'tout-les-enchers', component: ToutLesEnchersComponent },
  { path: 'mes-participations', loadComponent: () => import('./mesparticipations/mesparticipations').then(m => m.Mesparticipations) },
  { path: 'profil', loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent) }
];
