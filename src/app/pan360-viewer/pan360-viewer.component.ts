import { Component, ElementRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pano } from '../gallery/gallery.component';

@Component({
  selector: 'app-pan360-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pan360-viewer.component.html',
  styleUrls: ['./pan360-viewer.component.css']
})
export class Pan360ViewerComponent implements OnChanges {
  @Input() pano: Pano | null = null;
  private host = inject(ElementRef);
  private viewer: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pano']) {
      this.load();
    }
  }

  load() {
    const container = this.host.nativeElement.querySelector('#panoContainer') as HTMLElement;
    if (!container) return;
    // Destroy old viewer if any
    if (this.viewer && typeof this.viewer.destroy === 'function') {
      try { this.viewer.destroy(); } catch {}
    }
    if (!this.pano) return;

    this.viewer = (window as any).pannellum?.viewer('panoContainer', {
      type: 'equirectangular',
      panorama: this.pano.src,
      autoLoad: true,
      autoRotate: -1,
      showZoomCtrl: true,
      compass: false,
      hfov: 100,
      minHfov: 40,
      maxHfov: 120
    });
  }
}
