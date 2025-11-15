import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Restaurante } from '../models/restaurante.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getRestaurantes(): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(`${this.apiUrl}/restaurantes/`).pipe(
      map(restaurantes => restaurantes.map(r => this.mapearRestaurante(r)))
    );
  }

  getRestaurante(id: string | number): Observable<Restaurante> {
    return this.http.get<Restaurante>(`${this.apiUrl}/restaurantes/${id}/`).pipe(
      map(r => this.mapearRestaurante(r))
    );
  }

  buscarRestaurantes(termino: string): Observable<Restaurante[]> {
    const params = new HttpParams().set('search', termino);
    return this.http.get<Restaurante[]>(`${this.apiUrl}/restaurantes/`, { params }).pipe(
      map(restaurantes => restaurantes.map(r => this.mapearRestaurante(r)))
    );
  }

  crearRestaurante(restaurante: Restaurante): Observable<Restaurante> {
    // Crear objeto limpio solo con campos necesarios
    const data: any = {
      nombre: restaurante.nombre,
      direccion: restaurante.direccion,
      telefono: restaurante.telefono
    };

    // Solo agregar campos opcionales si tienen valor
    if (restaurante.capacidad) {
      data.capacidad_maxima = Number(restaurante.capacidad);
    }

    console.log('===== DATOS A ENVIAR AL BACKEND =====');
    console.log(JSON.stringify(data, null, 2));
    console.log('=====================================');

    return this.http.post<Restaurante>(`${this.apiUrl}/restaurantes/`, data).pipe(
      map(r => this.mapearRestaurante(r))
    );
  }

  actualizarRestaurante(id: string | number, restaurante: Restaurante): Observable<Restaurante> {
    const data: any = {
      nombre: restaurante.nombre,
      direccion: restaurante.direccion,
      telefono: restaurante.telefono
    };

    if (restaurante.capacidad) {
      data.capacidad_maxima = Number(restaurante.capacidad);
    }

    return this.http.put<Restaurante>(`${this.apiUrl}/restaurantes/${id}/`, data).pipe(
      map(r => this.mapearRestaurante(r))
    );
  }

  eliminarRestaurante(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/restaurantes/${id}/`);
  }

  private mapearRestaurante(restaurante: any): Restaurante {
    const id = restaurante.id_restaurante || restaurante.id;
    return {
      ...restaurante,
      id_restaurante: id,
      id: id,
      capacidad: restaurante.capacidad_maxima || restaurante.capacidad,
      capacidad_maxima: restaurante.capacidad_maxima || restaurante.capacidad
    };
  }
}




