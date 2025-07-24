import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from './auth.service';
import { LearningResourcesComponent } from "../learning-resources/learning-resources.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, LearningResourcesComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  private authService = inject(AuthService);

  isAdmin = computed(() => this.authService.activePermission() === 'admin');
}
