import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Restaurante } from '../models/restaurante.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL base del backend FastAPI
  private apiUrl = 'http://127.0.0.1:8000'; // Backend FastAPI

  constructor(private http: HttpClient) {}

  // Obtener lista completa
  getRestaurantes(): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(`${this.apiUrl}/restaurantes/`).pipe(
      map(restaurantes => restaurantes.map(r => this.mapearRestaurante(r)))
    );
  }

  // Obtener un restaurante por ID (puede ser UUID string o number)
  getRestaurante(id: string | number): Observable<Restaurante> {
    return this.http.get<Restaurante>(`${this.apiUrl}/restaurantes/${id}`).pipe(
      map(r => this.mapearRestaurante(r))
    );
  }

  // Buscar restaurantes con filtro
  buscarRestaurantes(termino: string): Observable<Restaurante[]> {
    const params = new HttpParams().set('search', termino);
    return this.http.get<Restaurante[]>(`${this.apiUrl}/restaurantes/`, { params }).pipe(
      map(restaurantes => restaurantes.map(r => this.mapearRestaurante(r)))
    );
  }

  // Crear nuevo restaurante
  crearRestaurante(restaurante: Restaurante): Observable<Restaurante> {
    const data = this.prepararDatosParaBackend(restaurante);
    return this.http.post<Restaurante>(`${this.apiUrl}/restaurantes/`, data).pipe(
      map(r => this.mapearRestaurante(r))
    );
  }

  // Actualizar restaurante
  actualizarRestaurante(id: string | number, restaurante: Restaurante): Observable<Restaurante> {
    const data = this.prepararDatosParaBackend(restaurante);
    return this.http.put<Restaurante>(`${this.apiUrl}/restaurantes/${id}/`, data).pipe(
      map(r => this.mapearRestaurante(r))
    );
  }

  // Eliminar restaurante
  eliminarRestaurante(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/restaurantes/${id}/`);
  }

  // Mapear restaurante del backend al formato del frontend
  private mapearRestaurante(restaurante: any): Restaurante {
    return {
      ...restaurante,
      id: restaurante.id_restaurante || restaurante.id,
      capacidad: restaurante.capacidad_maxima || restaurante.capacidad
    };
  }

  // Preparar datos del frontend para enviar al backend
  private prepararDatosParaBackend(restaurante: Restaurante): any {
    const { id, capacidad, tipo_cocina, ...resto } = restaurante;
    return {
      ...resto,
      capacidad_maxima: capacidad || restaurante.capacidad_maxima
    };
  }
}

