import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/Accueil', pathMatch: 'full' },
  { path: 'Accueil', loadComponent: () => import('./accueil/accueil').then(m => m.AccueilComponent) },
  { path: 'Apropos', loadComponent: () => import('./apropos/apropos').then(m => m.AproposComponent) },
  { path: 'faq', loadComponent: () => import('./faq/faq').then(m => m.FaqComponent) }
];
