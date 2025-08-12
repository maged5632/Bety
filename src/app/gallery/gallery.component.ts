// src/app/gallery/gallery.component.ts
import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HOME_TOUR } from '../tour.data';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  items = HOME_TOUR.map(s => ({ id: s.id, name: s.name, thumb: s.imageUrl }));
}
