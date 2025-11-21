// src/app/property-details/property-details.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Property } from '../property.data';
import { PropertyService } from '../property.service';
import { VirtualTourComponent } from '../virtual-tour/virtual-tour';

/**
 * PropertyDetailsComponent
 * ------------------------
 * Shows details for a single property, including:
 *  - hero image + thumbnail gallery
 *  - stats
 *  - inline 360° viewer
 *  - contact agent form
 *
 * URL pattern: /property/:id
 */
@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [RouterLink, DecimalPipe, VirtualTourComponent, FormsModule],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css'
})
export class PropertyDetailsComponent implements OnInit, OnDestroy {

  /** Currently selected property (or null if not found). */
  property: Property | null = null;

  /** Index of the currently active hero image. */
  activeImageIndex = 0;

  /** Contact form model. */
  contact = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  submitted = false;

  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.sub = this.propertyService.getPropertyById(id).subscribe((p) => {
      this.property = p ?? null;
      this.activeImageIndex = 0; // reset to first image whenever property changes
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** Link to full-screen 360 viewer. */
  get tourLink(): (string | null)[] | null {
    if (!this.property) return null;
    return ['/view', this.property.panoId];
  }

  /** Map panoId ("p1") to index for [panoIndex]. */
  get panoIndex(): number | null {
    if (!this.property) return null;

    const match = /^p(\d+)$/.exec(this.property.panoId);
    if (!match) return 0;

    const idx = parseInt(match[1], 10) - 1;
    return isNaN(idx) || idx < 0 ? 0 : idx;
  }

  /**
   * Current hero image URL.
   * - If property.images exists → use it
   * - Otherwise fall back to thumbnail
   */
  get heroImageUrl(): string {
    if (!this.property) return '';

    const imgs = this.property.images && this.property.images.length
      ? this.property.images
      : [this.property.thumbnail];

    return imgs[this.activeImageIndex] ?? imgs[0];
  }

  /**
   * Called when user clicks a thumbnail button.
   */
  selectImage(index: number): void {
    if (!this.property || !this.property.images) return;
    if (index < 0 || index >= this.property.images.length) return;

    this.activeImageIndex = index;
  }

  onSubmit(): void {
    if (!this.property) return;

    console.log('Contact request for property:', this.property);
    console.log('Contact form data:', this.contact);

    this.submitted = true;
  }
}
