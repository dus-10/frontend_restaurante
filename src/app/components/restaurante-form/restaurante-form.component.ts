import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Restaurante } from '../../models/restaurante.model';

@Component({
  selector: 'app-restaurante-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './restaurante-form.component.html',
  styleUrl: './restaurante-form.component.css'
})
export class RestauranteFormComponent implements OnInit {
  restaurante: Restaurante = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    capacidad_maxima: undefined,
    capacidad: undefined, // Alias para el formulario
    tipo_cocina: ''
  };

  esEdicion = signal<boolean>(false);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);
  restauranteId: string | number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'undefined' && id !== 'null') {
      this.esEdicion.set(true);
      // El ID puede ser UUID (string) o número
      this.restauranteId = id;
      this.cargarRestaurante(this.restauranteId);
    } else {
      console.error('ID no válido en la ruta:', id);
      this.error.set('ID de restaurante no válido.');
    }
  }

  cargarRestaurante(id: string | number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.apiService.getRestaurante(id).subscribe({
      next: (data) => {
        this.restaurante = data;
        // Asegurar que capacidad_maxima se mapee a capacidad para el formulario
        if (data.capacidad_maxima !== undefined && data.capacidad === undefined) {
          this.restaurante.capacidad = data.capacidad_maxima;
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar restaurante:', err);
        this.error.set('Error al cargar el restaurante.');
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    // Validar que tenemos el ID si estamos editando
    if (this.esEdicion() && (!this.restauranteId || this.restauranteId === 'undefined' || this.restauranteId === 'null')) {
      this.error.set('Error: No se pudo obtener el ID del restaurante para editar.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    // Crear una copia sin el ID para evitar enviarlo en el cuerpo
    const { id, ...restauranteData } = this.restaurante;

    if (this.esEdicion() && this.restauranteId) {
      // Actualizar
      this.apiService.actualizarRestaurante(this.restauranteId, restauranteData).subscribe({
        next: () => {
          this.router.navigate(['/restaurantes']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          const errorMessage = err?.error?.detail || err?.error?.message || err?.message || 'Error al actualizar el restaurante.';
          this.error.set(`Error al actualizar: ${errorMessage}`);
          this.cargando.set(false);
        }
      });
    } else {
      // Crear
      this.apiService.crearRestaurante(restauranteData).subscribe({
        next: () => {
          this.router.navigate(['/restaurantes']);
        },
        error: (err) => {
          console.error('Error al crear:', err);
          const errorMessage = err?.error?.detail || err?.error?.message || err?.message || 'Error al crear el restaurante.';
          this.error.set(`Error al crear: ${errorMessage}`);
          this.cargando.set(false);
        }
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.restaurante.nombre || !this.restaurante.direccion || !this.restaurante.telefono) {
      this.error.set('Por favor completa todos los campos obligatorios.');
      return false;
    }
    return true;
  }

  cancelar(): void {
    this.router.navigate(['/restaurantes']);
  }
}

