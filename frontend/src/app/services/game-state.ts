import { Injectable, signal } from '@angular/core';
import { Chess } from 'chess.js';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private game = new Chess();

  private fenSignal = signal(this.game.fen());
  private moveHistorySignal = signal<string[]>([]);
  private evaluationSignal = signal('...');
  private evaluationScoreSignal = signal(0);

  readonly fen = this.fenSignal.asReadonly();
  readonly moveHistory = this.moveHistorySignal.asReadonly();
  readonly evaluation = this.evaluationSignal.asReadonly();
  readonly evaluationScore = this.evaluationScoreSignal.asReadonly();

  getGame(): Chess {
    return this.game;
  }

  makeMove(from: string, to: string, promotion?: string): any {
    try {
      const move = this.game.move({ from, to, promotion: promotion || 'q' });
      if (move) {
        this.fenSignal.set(this.game.fen());
        this.moveHistorySignal.update(history => [...history, move.san]);
        return move;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  undoMove(): boolean {
    const move = this.game.undo();
    if (move) {
      this.fenSignal.set(this.game.fen());
      this.moveHistorySignal.update(history => history.slice(0, -1));
      return true;
    }
    return false;
  }

  updateEvaluation(text: string, score: number) {
    this.evaluationSignal.set(text);
    this.evaluationScoreSignal.set(score);
  }

  resetGame() {
    this.game.reset();
    this.syncFromGame();
  }

  getFen(): string {
    return this.game.fen();
  }

  getPgn(): string {
    return this.game.pgn();
  }

  loadPgn(pgn: string): boolean {
    try {
      this.game.loadPgn(pgn);
    } catch {
      return false;
    }
    this.syncFromGame();
    return true;
  }

  private syncFromGame() {
    this.fenSignal.set(this.game.fen());
    this.moveHistorySignal.set(this.game.history());
    this.evaluationSignal.set('...');
    this.evaluationScoreSignal.set(0);
  }
}
