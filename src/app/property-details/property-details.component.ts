// src/app/property-details/property-details.component.ts

import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
// NgIf → used in the template (*ngIf)
// DecimalPipe → gives us the "number" pipe for price formatting
import { NgIf, DecimalPipe } from '@angular/common';

import { PROPERTIES, Property } from '../property.data';
// Inline 360° viewer component
import { VirtualTourComponent } from '../virtual-tour/virtual-tour';

/**
 * PropertyDetailsComponent
 * ------------------------
 * Shows detailed information about a single property.
 *
 * URL pattern: /property/:id
 */
@Component({
  selector: 'app-property-details',
  standalone: true,

  /**
   * Standalone components must list all directives & pipes they use.
   * - NgIf              → for *ngIf and <ng-template #notFound>
   * - RouterLink        → for [routerLink] bindings
   * - DecimalPipe       → for the "number" pipe in price formatting
   * - VirtualTourComponent → inline 360° viewer block at the bottom
   */
  imports: [NgIf, RouterLink, DecimalPipe, VirtualTourComponent],

  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css'
})
export class PropertyDetailsComponent {

  /** Route parameter "id" (e.g. "prop1"). */
  private id = signal<string | null>(null);

  /** Current property, derived from the route id. */
  property = computed<Property | undefined>(() => {
    const id = this.id();
    return PROPERTIES.find(p => p.id === id);
  });

  constructor(private route: ActivatedRoute) {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    this.id.set(idFromRoute);
  }

  /** Link to legacy full-screen /view/:panoId page (optional). */
  get tourLink(): (string | null)[] | null {
    const prop = this.property();
    if (!prop) return null;
    return ['/view', prop.panoId];
  }

  /**
   * Convert property.panoId ("p1", "p2", ...) to index (0,1,2,...)
   * for the [panoIndex] input of VirtualTourComponent.
   */
  get panoIndex(): number | null {
    const prop = this.property();
    if (!prop) return null;

    const match = /^p(\d+)$/.exec(prop.panoId);
    if (!match) {
      return 0;
    }

    const idx = parseInt(match[1], 10) - 1;
    return isNaN(idx) || idx < 0 ? 0 : idx;
  }
}
