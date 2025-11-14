import { Routes } from '@angular/router';
import { RestaurantesListComponent } from './components/restaurantes-list/restaurantes-list.component';
import { RestauranteFormComponent } from './components/restaurante-form/restaurante-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/restaurantes', pathMatch: 'full' },
  { path: 'restaurantes', component: RestaurantesListComponent },
  { path: 'restaurantes/nuevo', component: RestauranteFormComponent },
  { path: 'restaurantes/editar/:id', component: RestauranteFormComponent },
  { path: '**', redirectTo: '/restaurantes' }
];
