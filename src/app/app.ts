// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ChatbotWidgetComponent } from './shared/chatbot-widget/chatbot-widget';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink, RouterLinkActive, ChatbotWidgetComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})

export class App {}
