// src/app/virtual-tour/virtual-tour.ts

import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';

// pannellum is loaded globally in index.html, so we declare it here
declare const pannellum: any;

/**
 * PanoInfo
 * --------
 * Matches the structure of each entry in /assets/panos/manifest.json
 */

interface PanoInfo {
  name: string; // e.g. "pano1.jpg"
  src: string;  // e.g. "assets/panos/pano1.jpg"
  width: number;
  height: number;
}

/**
 * VirtualTourComponent
 * --------------------
 * A reusable 360° viewer component.
 *
 * - It loads the list of panos from /assets/panos/manifest.json.
 * - It can optionally accept an initial pano index via @Input() panoIndex.
 * - It renders a pannellum viewer and buttons to switch scenes.
 */
@Component({
  selector: 'app-virtual-tour',
  standalone: true,
  templateUrl: './virtual-tour.html',
  styleUrl: './virtual-tour.css',
  imports: [NgFor, NgIf]
})
export class VirtualTourComponent implements AfterViewInit {

  /**
   * Reference to the <div #panoRef> in the template.
   * This is the container where pannellum will draw the 360 viewer.
   */
  @ViewChild('panoRef', { static: true })
  panoRef!: ElementRef<HTMLDivElement>;

  /**
   * Optional input: index of the pano to show first.
   *
   * Example:
   *   <app-virtual-tour [panoIndex]="2"></app-virtual-tour>
   *
   * If null or out of range, the component falls back to index 0.
   */
  @Input() panoIndex: number | null = null;

  /** All panos loaded from manifest.json */
  panos: PanoInfo[] = [];

  /** Currently active pano index (used for highlighting buttons, etc.) */
  currentIndex = 0;

  /** pannellum viewer instance */
  private viewer: any;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    // Step 1: load the pano manifest from /assets
    this.http.get<PanoInfo[]>('/assets/panos/manifest.json').subscribe({
      next: (data) => {
        console.log('Manifest loaded successfully:', data);
        this.panos = data || [];

        if (!this.panos.length) {
          console.warn('Manifest is empty, nothing to show.');
          return;
        }

        // Decide which pano to show first:
        // - if panoIndex input is valid, use it
        // - otherwise fall back to 0
        let initial = this.panoIndex ?? 0;
        if (initial < 0 || initial >= this.panos.length) {
          initial = 0;
        }
        this.currentIndex = initial;

        this.initViewer(this.panos[initial]);
      },
      error: (err) => {
        console.error('Error loading manifest.json:', err);
      }
    });
  }

  /**
   * Initialise pannellum viewer with a given pano.
   * If viewer already exists, just switch its panorama.
   */
  private initViewer(pano: PanoInfo): void {
    if (!this.panoRef?.nativeElement) {
      console.error('panoRef is not available.');
      return;
    }

    // First-time setup: create a new pannellum viewer
    if (!this.viewer) {
      this.viewer = pannellum.viewer(this.panoRef.nativeElement, {
        type: 'equirectangular',
        panorama: pano.src,
        autoLoad: true,
        showControls: true,
        compass: false,
        hfov: 100,
        yaw: 0,
        pitch: 0
      });

      console.log('Pannellum viewer initialised with', pano.src);
      return;
    }

    // If viewer already exists, just switch the image
    this.viewer.setPanorama(pano.src);
    console.log('Pannellum viewer switched to', pano.src);
  }

  /**
   * Called when a thumbnail/button is clicked in the template.
   * Updates the currentIndex and loads the new pano into pannellum.
   */
  switchTo(index: number): void {
    if (!this.panos[index] || !this.viewer) return;
    this.currentIndex = index;
    const pano = this.panos[index];
    this.viewer.setPanorama(pano.src);
    console.log('Switched to pano:', pano.src);
  }
  
}
