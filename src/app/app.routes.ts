// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { GalleryComponent } from './gallery/gallery.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { VirtualTourComponent } from './virtual-tour/virtual-tour';
import { LoginComponent } from './login/login';
import { AdminComponent } from './admin/admin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'property/:id', component: PropertyDetailsComponent },
  { path: 'view/:panoId', component: VirtualTourComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent }
];
