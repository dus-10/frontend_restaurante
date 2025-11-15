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
    capacidad: undefined,
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
    
    console.log('ID recibido de la ruta:', id);
    
    // ✅ CORRECCIÓN: Solo es edición si hay un ID válido Y no es 'nuevo'
    if (id && id !== 'nuevo' && id !== 'undefined' && id !== 'null') {
      console.log('Modo EDICIÓN detectado');
      this.esEdicion.set(true);
      this.restauranteId = id;
      this.cargarRestaurante(this.restauranteId);
    } else {
      console.log('Modo CREACIÓN detectado');
      this.esEdicion.set(false);
      this.restauranteId = null;
    }
  }

  cargarRestaurante(id: string | number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.apiService.getRestaurante(id).subscribe({
      next: (data) => {
        console.log('Restaurante cargado para editar:', data);
        this.restaurante = { ...data };
        
        // Mapear capacidad_maxima a capacidad para el formulario
        if (data.capacidad_maxima !== undefined) {
          this.restaurante.capacidad = data.capacidad_maxima;
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar restaurante:', err);
        this.error.set('Error al cargar el restaurante. Verifica que exista.');
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    console.log('Método guardar() ejecutado');
    console.log('esEdicion:', this.esEdicion());
    console.log('restauranteId:', this.restauranteId);
    console.log('Datos del restaurante ANTES de limpiar:', this.restaurante);
  
    if (!this.validarFormulario()) {
      return;
    }
  
    // ✅ CRÍTICO: Limpiar email si está vacío
    if (!this.restaurante.email || this.restaurante.email.trim() === '') {
      delete this.restaurante.email;
    }
  
    console.log('Datos del restaurante DESPUÉS de limpiar:', this.restaurante);
  
    this.cargando.set(true);
    this.error.set(null);
  
    // Preparar datos: eliminar campos que no deben enviarse
    const { id, id_restaurante, fecha_creacion, fecha_edicion, ...restauranteData } = this.restaurante;
  
    if (this.esEdicion() && this.restauranteId) {
      // ========== ACTUALIZAR ==========
      console.log('ACTUALIZANDO restaurante con ID:', this.restauranteId);
      console.log('Datos a enviar:', restauranteData);
      
      this.apiService.actualizarRestaurante(this.restauranteId, restauranteData).subscribe({
        next: (response) => {
          console.log('Restaurante actualizado exitosamente:', response);
          this.router.navigate(['/restaurantes']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          const errorMessage = this.extraerMensajeError(err);
          this.error.set(`Error al actualizar: ${errorMessage}`);
          this.cargando.set(false);
        }
      });
    } else {
      // ========== CREAR ==========
      console.log('CREANDO nuevo restaurante');
      console.log('Datos a enviar:', restauranteData);
      
      this.apiService.crearRestaurante(restauranteData).subscribe({
        next: (response) => {
          console.log('Restaurante creado exitosamente:', response);
          this.router.navigate(['/restaurantes']);
        },
        error: (err) => {
          console.error('Error al crear:', err);
          const errorMessage = this.extraerMensajeError(err);
          this.error.set(`Error al crear: ${errorMessage}`);
          this.cargando.set(false);
        }
      });
    }
  }

  validarFormulario(): boolean {
    console.log('Validando formulario...');
    
    if (!this.restaurante.nombre?.trim()) {
      this.error.set('El nombre es obligatorio.');
      return false;
    }
    if (!this.restaurante.direccion?.trim()) {
      this.error.set('La dirección es obligatoria.');
      return false;
    }
    if (!this.restaurante.telefono?.trim()) {
      this.error.set('El teléfono es obligatorio.');
      return false;
    }
    
    console.log('Formulario válido');
    return true;
  }

  private extraerMensajeError(err: any): string {
    if (err?.error?.detail) {
      if (typeof err.error.detail === 'string') {
        return err.error.detail;
      }
      if (Array.isArray(err.error.detail)) {
        return err.error.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
      }
      return JSON.stringify(err.error.detail);
    }
    if (err?.error?.message) {
      return err.error.message;
    }
    if (err?.message) {
      return err.message;
    }
    if (err?.status === 0) {
      return 'No se puede conectar con el backend. Verifica que esté corriendo en http://127.0.0.1:8000';
    }
    return 'Error desconocido';
  }

  cancelar(): void {
    this.router.navigate(['/restaurantes']);
  }
}
