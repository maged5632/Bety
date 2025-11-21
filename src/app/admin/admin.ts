// src/app/admin/admin.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Property } from '../property.data';
import { PropertyService } from '../property.service';
import { AuthService } from '../auth.service';

/**
 * AdminComponent
 * --------------
 * Admin panel to view, add, edit, and delete properties in memory.
 *
 * NOTE:
 *  - This does NOT save to JSON or a real DB.
 *  - It uses PropertyService, so the gallery updates immediately.
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit, OnDestroy {
  /** All properties loaded from the service. */
  properties: Property[] = [];

  /** Id of the property currently being edited (null = add mode). */
  editingId: string | null = null;

  /** Form model for new / edited property. */
  newProperty: Partial<Property> = {
    title: '',
    address: '',
    city: '',
    price: 0,
    beds: 1,
    baths: 1,
    area: 50,
    thumbnail: '',
    panoId: '',
    images: []
  };

  /** Feedback message after action. */
  successMessage = '';

  private sub?: Subscription;

  constructor(
    public auth: AuthService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.sub = this.propertyService.getProperties().subscribe((list) => {
      this.properties = list;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** Is user allowed to access this page? */
  get canAccess(): boolean {
    return this.auth.isLoggedIn;
  }

  logout(): void {
    this.auth.logout();
  }

  /** Start editing an existing property. */
  startEdit(prop: Property): void {
    this.editingId = prop.id;
    this.successMessage = '';

    this.newProperty = {
      id: prop.id,
      title: prop.title,
      address: prop.address,
      city: prop.city,
      price: prop.price,
      beds: prop.beds,
      baths: prop.baths,
      area: prop.area,
      thumbnail: prop.thumbnail,
      panoId: prop.panoId,
      images: prop.images ? [...prop.images] : []
    };
  }

  /** Cancel edit and go back to "add new" mode. */
  cancelEdit(): void {
    this.editingId = null;
    this.successMessage = '';
    this.resetForm();
  }

  /** Remove property completely. */
  delete(prop: Property): void {
    if (!confirm(`Delete property "${prop.title}"?`)) {
      return;
    }

    this.propertyService.deleteProperty(prop.id);
    this.successMessage = `Property "${prop.title}" deleted.`;
    if (this.editingId === prop.id) {
      this.cancelEdit();
    }
  }

  /** Submit handler: add or update depending on editingId. */
  onSubmit(): void {
    if (!this.newProperty.title || !this.newProperty.address || !this.newProperty.city) {
      return;
    }

    const id = this.editingId ?? 'prop-' + Date.now();

    const prop: Property = {
      id,
      title: this.newProperty.title!,
      address: this.newProperty.address!,
      city: this.newProperty.city!,
      price: Number(this.newProperty.price) || 0,
      beds: Number(this.newProperty.beds) || 0,
      baths: Number(this.newProperty.baths) || 0,
      area: Number(this.newProperty.area) || 0,
      thumbnail: this.newProperty.thumbnail || 'assets/panos/pano1.jpg',
      panoId: this.newProperty.panoId || 'p1',
      images: this.newProperty.images && this.newProperty.images.length
        ? this.newProperty.images
        : [this.newProperty.thumbnail || 'assets/panos/pano1.jpg']
    };

    if (this.editingId) {
      this.propertyService.updateProperty(prop);
      this.successMessage = `Property "${prop.title}" updated.`;
    } else {
      this.propertyService.addProperty(prop);
      this.successMessage = `Property "${prop.title}" added (id: ${prop.id}).`;
    }

    // Reset to add mode
    this.editingId = null;
    this.resetForm(prop.city);
  }

  /** Helper to reset form (optionally keep city). */
  private resetForm(keepCity?: string): void {
    this.newProperty = {
      title: '',
      address: '',
      city: keepCity ?? '',
      price: 0,
      beds: 1,
      baths: 1,
      area: 50,
      thumbnail: '',
      panoId: '',
      images: []
    };
  }

  /**
   * Helper to convert comma-separated image URLs (from input)
   * into an array and store it in newProperty.images.
   */
  updateImagesFromText(value: string): void {
    const parts = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    this.newProperty.images = parts;
  }

  /** Used in the input [value] binding. */
  get imagesAsText(): string {
    return (this.newProperty.images || []).join(', ');
  }
}
