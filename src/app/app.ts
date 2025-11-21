// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,

  // IMPORTANT: Add RouterLink and RouterLinkActive here
  imports: [RouterOutlet, RouterLink, RouterLinkActive],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
