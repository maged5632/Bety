// src/app/gallery/gallery.component.ts

import { Component } from '@angular/core';
// Common Angular building blocks used in the template:
// - NgFor: for *ngFor loops
// - NgIf: for *ngIf conditions
// - DecimalPipe: the "number" pipe we use to format prices
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// Property data model + demo list of properties
import { PROPERTIES, Property } from '../property.data';

@Component({
  selector: 'app-gallery',
  standalone: true,

  /**
   * Standalone components MUST declare every directive/pipe they use here.
   * If you forget DecimalPipe, Angular will say:
   *   "No pipe found with name 'number'."
   */
  imports: [NgFor, NgIf, RouterLink, DecimalPipe],

  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  /**
   * List of properties to display in the gallery.
   *
   * For now, this comes from a static constant (PROPERTIES).
   * Later you can:
   *  - Replace it with an HTTP call to a backend,
   *  - Or load it from a JSON file / database.
   */
  properties: Property[] = PROPERTIES;
}
