import { Routes } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { Pan360ViewerComponent } from './pan360-viewer/pan360-viewer.component';
import { Home } from './home/home';
import { PropertyDetailsComponent } from './property-details/property-details.component';

/**
 * Application routes
 * -------------------
 * ''              → home page
 * 'gallery'       → property cards
 * 'property/:id'  → property details page
 * 'view/:id'      → full-screen 360 viewer
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },
  { path: 'gallery', component: GalleryComponent },
  { path: 'property/:id', component: PropertyDetailsComponent },
  { path: 'view/:id', component: Pan360ViewerComponent },
  { path: '**', redirectTo: '' }
];
