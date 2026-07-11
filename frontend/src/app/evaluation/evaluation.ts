import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../services/game-state';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluation.html'
})
export class EvaluationComponent {
  private gameState = inject(GameStateService);
  evaluation = this.gameState.evaluation;
  score = this.gameState.evaluationScore;
}
