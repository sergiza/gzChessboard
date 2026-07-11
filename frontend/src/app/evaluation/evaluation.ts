import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../services/game-state';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluation.html',
  styleUrl: './evaluation.css'
})
export class EvaluationComponent {
  evaluation = inject(GameStateService).evaluation;
}
