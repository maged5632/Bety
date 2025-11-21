// src/app/home/home.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * HomeComponent
 * -------------
 * Simple landing page:
 *  - Hero section with main CTAs
 *  - No inline 360° viewer here (tours live on /gallery and /property pages)
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {}
