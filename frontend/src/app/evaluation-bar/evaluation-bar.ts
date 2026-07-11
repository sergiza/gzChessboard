import { Component, computed, inject } from '@angular/core';
import { GameStateService } from '../services/game-state';

@Component({
  selector: 'app-evaluation-bar',
  standalone: true,
  imports: [],
  templateUrl: './evaluation-bar.html',
  styleUrl: './evaluation-bar.css'
})
export class EvaluationBarComponent {
  private gameState = inject(GameStateService);

  // Cap evaluation at +/-10 and convert to a 0-100 percentage (mate arrives as +/-100)
  whitePercentage = computed(() => {
    const capped = Math.max(-10, Math.min(10, this.gameState.evaluationScore()));
    return ((capped + 10) / 20) * 100;
  });
}
