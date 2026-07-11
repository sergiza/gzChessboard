import { Component, effect, inject, signal } from '@angular/core';
import { GameStateService } from '../services/game-state';
import { BackendApiService } from '../services/backend-api';

@Component({
  selector: 'app-opening',
  standalone: true,
  imports: [],
  templateUrl: './opening.html',
  styleUrl: './opening.css'
})
export class OpeningComponent {
  private gameState = inject(GameStateService);
  private api = inject(BackendApiService);

  openingName = signal('Starting Position');
  eco = signal('');

  constructor() {
    effect(() => {
      const moves = this.gameState.moveHistory();
      if (moves.length === 0) {
        this.openingName.set('Starting Position');
        this.eco.set('');
        return;
      }

      this.api.getOpening(moves).subscribe({
        next: (response: any) => {
          this.openingName.set(response.name);
          this.eco.set(response.eco);
        },
        error: () => {
          this.openingName.set('Unknown');
          this.eco.set('');
        }
      });
    });
  }
}
