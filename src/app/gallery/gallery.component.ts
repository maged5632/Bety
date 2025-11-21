// src/app/gallery/gallery.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Property } from '../property.data';
import { PropertyService } from '../property.service';

/**
 * GalleryComponent
 * ----------------
 * Shows a grid of property cards + filter bar.
 * Data now comes from PropertyService (which loads JSON).
 */
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe, FormsModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {
  /** All properties from the service. */
  properties: Property[] = [];

  /** Subscription to the PropertyService stream. */
  private sub?: Subscription;

  /**
   * Filter model bound to inputs via [(ngModel)].
   */
  filters = {
    minPrice: null as number | null,
    maxPrice: null as number | null,
    minBeds: null as number | null,
    city: '' as string
  };

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.sub = this.propertyService.getProperties().subscribe((list) => {
      this.properties = list;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /**
   * Apply filters to the list of properties.
   */
  get filteredProperties(): Property[] {
    return this.properties.filter((p) => {
      if (this.filters.minPrice !== null && p.price < this.filters.minPrice) {
        return false;
      }
      if (this.filters.maxPrice !== null && p.price > this.filters.maxPrice) {
        return false;
      }
      if (this.filters.minBeds !== null && p.beds < this.filters.minBeds) {
        return false;
      }
      if (this.filters.city.trim().length > 0) {
        const cityFilter = this.filters.city.trim().toLowerCase();
        if (!p.city.toLowerCase().includes(cityFilter)) {
          return false;
        }
      }
      return true;
    });
  }

  clearFilters(): void {
    this.filters = {
      minPrice: null,
      maxPrice: null,
      minBeds: null,
      city: ''
    };
  }
}
