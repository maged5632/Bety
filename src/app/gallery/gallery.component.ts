import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Pano {
  name: string;
  src: string;
  width?: number;
  height?: number;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  @Input() images: Pano[] = [];
  @Output() selectPano = new EventEmitter<Pano>();

  pick(p: Pano) {
    this.selectPano.emit(p);
  }
}
