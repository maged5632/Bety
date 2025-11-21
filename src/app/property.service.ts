// src/app/property.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Property } from './property.data';

/**
 * PropertyService
 * ---------------
 * Central place to load and manage property data.
 *
 * - Loads /assets/properties.json once on startup.
 * - Exposes an observable stream of properties.
 * - Supports add / update / delete in memory.
 */
@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  /** Internal subject holding the current list of properties. */
  private readonly propertiesSubject = new BehaviorSubject<Property[]>([]);

  /** Public observable stream of properties. */
  readonly properties$ = this.propertiesSubject.asObservable();

  private loaded = false;

  constructor(private http: HttpClient) {
    this.loadOnce();
  }

  /**
   * Ensure we load the JSON only once.
   */
  private loadOnce(): void {
    if (this.loaded) return;
    this.loaded = true;

    this.http
      .get<Property[]>('/assets/properties.json')
      .subscribe({
        next: (data) => {
          console.log('Loaded properties.json:', data);
          this.propertiesSubject.next(data || []);
        },
        error: (err) => {
          console.error('Error loading properties.json', err);
          // Keep an empty list on error
          this.propertiesSubject.next([]);
        }
      });
  }

  /**
   * Get observable list of all properties.
   */
  getProperties(): Observable<Property[]> {
    this.loadOnce();
    return this.properties$;
  }

  /**
   * Get an observable of a *single* property by id.
   */
  getPropertyById(id: string): Observable<Property | undefined> {
    this.loadOnce();
    return this.properties$.pipe(
      map((list) => list.find((p) => p.id === id))
    );
  }

  /**
   * Add a new property in memory.
   */
  addProperty(prop: Property): void {
    const current = this.propertiesSubject.getValue();
    this.propertiesSubject.next([...current, prop]);
  }

  /**
   * Update an existing property (matched by id).
   * If the id doesn't exist, nothing happens.
   */
  updateProperty(updated: Property): void {
    const current = this.propertiesSubject.getValue();
    const idx = current.findIndex((p) => p.id === updated.id);
    if (idx === -1) {
      console.warn('updateProperty: id not found', updated.id);
      return;
    }

    const next = [...current];
    next[idx] = { ...updated };
    this.propertiesSubject.next(next);
  }

  /**
   * Delete a property by id.
   */
  deleteProperty(id: string): void {
    const current = this.propertiesSubject.getValue();
    const next = current.filter((p) => p.id !== id);
    this.propertiesSubject.next(next);
  }
}
