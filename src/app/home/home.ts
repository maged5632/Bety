import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VirtualTourComponent } from '../virtual-tour/virtual-tour';  // 👈 our new component

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, VirtualTourComponent],  // 👈 include it here
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
