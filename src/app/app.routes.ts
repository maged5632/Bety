// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { GalleryComponent } from './gallery/gallery.component';
import { LoginComponent } from './login/login';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { VirtualTourComponent } from './virtual-tour/virtual-tour';
import { UserRegisterComponent } from './user-register/user-register';
import { UserLoginComponent } from './user-login/user-login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'login', component: LoginComponent },           // Admin
  { path: 'register', component: UserRegisterComponent }, // User register
  { path: 'user-login', component: UserLoginComponent },  // User login
  { path: 'property/:id', component: PropertyDetailsComponent },
  { path: 'view/:id', component: VirtualTourComponent },
  { path: '**', redirectTo: '' },
];
