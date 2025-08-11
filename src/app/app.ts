// src/app/app.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent, Pano } from './gallery/gallery.component';
import { Pan360ViewerComponent } from './pan360-viewer/pan360-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GalleryComponent, Pan360ViewerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('bety');
  images = signal<Pano[]>([]);
  current = signal<Pano | null>(null);

  constructor() {
    fetch('assets/panos/manifest.json')
      .then(r => r.json())
      .then((arr: Pano[]) => this.images.set(arr))
      .catch(() => this.images.set([]));
  }

  onSelect(p: Pano) {
    this.current.set(p);
  }
}
