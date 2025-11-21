// src/app/virtual-tour/virtual-tour.ts

import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * PanoInfo
 * --------
 * Matches entries in /assets/panos/manifest.json
 */
interface PanoInfo {
  name: string; // e.g. "pano1.jpg"
  src: string;  // e.g. "assets/panos/pano1.jpg"
  width: number;
  height: number;
}

// Pannellum is loaded globally from script in index.html
declare const pannellum: any;

/**
 * VirtualTourComponent
 * --------------------
 * Reusable 360° viewer.
 *
 * - Loads panos from /assets/panos/manifest.json
 * - Accepts an optional [panoIndex] input to choose initial scene
 * - Renders Pannellum viewer + buttons to switch between scenes
 */
@Component({
  selector: 'app-virtual-tour',
  standalone: true,

  /**
   * No extra imports needed here because the template uses
   * Angular's new built-in control flow (@if, @for),
   * not *ngIf / *ngFor directives.
   */
  imports: [],

  templateUrl: './virtual-tour.html',
  styleUrl: './virtual-tour.css'
})
export class VirtualTourComponent implements AfterViewInit {

  /**
   * Reference to the <div #panoRef> element where Pannellum will draw.
   */
  @ViewChild('panoRef', { static: true })
  panoRef!: ElementRef<HTMLDivElement>;

  /**
   * Optional initial pano index.
   * Example: <app-virtual-tour [panoIndex]="2"></app-virtual-tour>
   */
  @Input() panoIndex: number | null = null;

  /** List of panos loaded from manifest.json. */
  panos: PanoInfo[] = [];

  /** Index of the currently active pano. */
  currentIndex = 0;

  /** Pannellum viewer instance (created once). */
  private viewer: any;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    // Load panos manifest from /assets
    this.http.get<PanoInfo[]>('/assets/panos/manifest.json').subscribe({
      next: (data) => {
        console.log('Manifest loaded successfully:', data);
        this.panos = data || [];

        if (!this.panos.length) {
          console.warn('Manifest is empty, nothing to show.');
          return;
        }

        // Choose initial pano index
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
   * Initialise Pannellum viewer with a given pano.
   * If viewer already exists, just switch the panorama.
   */
  private initViewer(pano: PanoInfo): void {
    const container = this.panoRef.nativeElement;

    // First time: create viewer
    if (!this.viewer) {
      this.viewer = pannellum.viewer(container, {
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

    // Already have viewer: just switch the image
    this.viewer.setPanorama(pano.src);
    console.log('Pannellum viewer switched to', pano.src);
  }

  /**
   * Called when scene button is clicked.
   */
  switchTo(index: number): void {
    if (!this.panos[index] || !this.viewer) return;

    this.currentIndex = index;
    const pano = this.panos[index];
    this.viewer.setPanorama(pano.src);
    console.log('Switched to pano:', pano.src);
  }
}
