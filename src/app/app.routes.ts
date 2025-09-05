import { Routes } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { Pan360ViewerComponent } from './pan360-viewer/pan360-viewer.component';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },
  { path: 'gallery', component: GalleryComponent },
  { path: 'view/:id', component: Pan360ViewerComponent },
  { path: '**', redirectTo: '' }
];
