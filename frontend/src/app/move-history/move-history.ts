import { Component, computed, effect, inject } from '@angular/core';
import { GameStateService } from '../services/game-state';

@Component({
  selector: 'app-move-history',
  standalone: true,
  imports: [],
  templateUrl: './move-history.html'
})
export class MoveHistoryComponent {
  private gameState = inject(GameStateService);

  movePairs = computed(() => {
    const moves = this.gameState.moveHistory();
    const pairs: { white: string, black?: string }[] = [];
    for (let i = 0; i < moves.length; i += 2) {
      pairs.push({ white: moves[i], black: moves[i + 1] });
    }
    return pairs;
  });

  constructor() {
    // Auto-scroll to bottom whenever the move list changes
    effect(() => {
      this.gameState.moveHistory();
      setTimeout(() => {
        const container = document.getElementById('moveHistoryContainer');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    });
  }
}
