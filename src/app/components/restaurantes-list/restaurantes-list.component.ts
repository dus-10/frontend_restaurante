import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Restaurante } from '../../models/restaurante.model';

@Component({
  selector: 'app-restaurantes-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './restaurantes-list.component.html',
  styleUrl: './restaurantes-list.component.css'
})
export class RestaurantesListComponent implements OnInit {
  restaurantes = signal<Restaurante[]>([]);
  restaurantesFiltrados = signal<Restaurante[]>([]);
  terminoBusqueda = signal<string>('');
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarRestaurantes();
  }

  cargarRestaurantes(): void {
    this.cargando.set(true);
    this.error.set(null);
    
    this.apiService.getRestaurantes().subscribe({
      next: (data) => {
        console.log('Restaurantes recibidos del backend:', data);
        // Verificar si los restaurantes tienen ID
        if (data.length > 0) {
          console.log('Primer restaurante:', data[0]);
          console.log('Campos disponibles:', Object.keys(data[0]));
        }
        this.restaurantes.set(data);
        this.restaurantesFiltrados.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar restaurantes:', err);
        this.error.set('Error al cargar los restaurantes. Verifica que el backend esté corriendo.');
        this.cargando.set(false);
      }
    });
  }

  buscarRestaurantes(): void {
    const termino = this.terminoBusqueda().trim();
    
    if (!termino) {
      this.restaurantesFiltrados.set(this.restaurantes());
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.apiService.buscarRestaurantes(termino).subscribe({
      next: (data) => {
        this.restaurantesFiltrados.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error en la búsqueda:', err);
        this.error.set('Error al buscar restaurantes.');
        this.cargando.set(false);
        // En caso de error, mostrar todos
        this.restaurantesFiltrados.set(this.restaurantes());
      }
    });
  }
  eliminarRestaurante(id: string | number | undefined): void {
    if (!id || id === 'undefined' || id === 'null') {
      console.error('ID no válido para eliminar:', id);
      this.error.set('Error: No se pudo obtener el ID del restaurante para eliminar.');
      return;
    }
  
    const confirmMessage = '¿Estás seguro de que deseas eliminar este restaurante?\n\n' +
      'ADVERTENCIA: Esta acción eliminará también:\n' +
      '- Todos los menús asociados\n' +
      '- Todas las mesas del restaurante\n' +
      '- Todas las reservas realizadas\n\n' +
      'Esta acción NO se puede deshacer.';
  
    if (!confirm(confirmMessage)) {
      return;
    }
  
    this.cargando.set(true);
    this.error.set(null);
  
    console.log('Intentando eliminar restaurante con ID:', id);
  
    this.apiService.eliminarRestaurante(id).subscribe({
      next: () => {
        console.log('Restaurante eliminado exitosamente');
        // Recargar la lista después de eliminar
        this.cargarRestaurantes();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        let errorMessage = 'Error al eliminar el restaurante.';
        
        // Detectar errores específicos de base de datos
        if (err?.error?.detail) {
          const detail = err.error.detail;
          if (typeof detail === 'string') {
            if (detail.includes('NotNullViolation') || detail.includes('violates not-null constraint')) {
              errorMessage = 'No se puede eliminar el restaurante porque tiene menús, mesas o reservas asociadas. Elimina primero los datos relacionados.';
            } else if (detail.includes('ForeignKeyViolation') || detail.includes('foreign key constraint')) {
              errorMessage = 'No se puede eliminar el restaurante porque tiene datos relacionados (menús, mesas, reservas).';
            } else {
              errorMessage = `Error: ${detail.substring(0, 200)}...`;
            }
          } else {
            errorMessage = detail;
          }
        } else if (err?.error?.message) {
          errorMessage = err.error.message;
        } else if (err?.message) {
          errorMessage = err.message;
        }
        
        // ✅ CORRECCIÓN AQUÍ - Agregado paréntesis de apertura
        this.error.set(`Error al eliminar: ${errorMessage}`);
        this.cargando.set(false);
      }
    });
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda.set('');
    this.restaurantesFiltrados.set(this.restaurantes());
  }
}

