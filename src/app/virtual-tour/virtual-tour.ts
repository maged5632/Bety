import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const pannellum: any;  // pannellum comes from index.html CDN

interface PanoInfo {
  name: string;
  src: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-virtual-tour',
  standalone: true,
  templateUrl: './virtual-tour.html',
  styleUrl: './virtual-tour.css'
})
export class VirtualTourComponent implements AfterViewInit {

  @ViewChild('panoRef', { static: true })
  panoRef!: ElementRef<HTMLDivElement>;

  private viewer: any;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    // Step 1: load your existing manifest.json
    this.http.get<PanoInfo[]>('/assets/panos/manifest.json').subscribe({
      next: (data) => {
        console.log('Manifest loaded successfully:', data);
        if (!data || data.length === 0) {
          console.warn('Manifest is empty, nothing to show.');
          return;
        }
        // Step 2: initialise pannellum with the first pano
        this.initViewer(data[0]);
      },
      error: (err) => {
        console.error('Error loading manifest.json:', err);
      }
    });
  }

  private initViewer(firstPano: PanoInfo): void {
    if (!this.panoRef?.nativeElement) {
      console.error('panoRef is not available.');
      return;
    }

    this.viewer = pannellum.viewer(this.panoRef.nativeElement, {
      type: 'equirectangular',
      panorama: firstPano.src, // e.g. "assets/panos/pano1.jpg"
      autoLoad: true,
      showControls: true,
      compass: false,
      hfov: 100,
      yaw: 0,
      pitch: 0
    });

    console.log('Pannellum viewer initialised with', firstPano.src);
  }
}
