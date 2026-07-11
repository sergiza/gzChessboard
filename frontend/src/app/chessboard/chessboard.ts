import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// @ts-ignore
import { Chessboard, INPUT_EVENT_TYPE } from "cm-chessboard/src/Chessboard.js";
// @ts-ignore
import { PromotionDialog, PROMOTION_DIALOG_RESULT_TYPE } from "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js";
import { BackendApiService, EvaluationResponse } from '../services/backend-api';
import { GameStateService } from '../services/game-state';
import { MoveHistoryComponent } from '../move-history/move-history';
import { EvaluationComponent } from '../evaluation/evaluation';
import { EvaluationBarComponent } from '../evaluation-bar/evaluation-bar';
import { OpeningComponent } from '../opening/opening';
import { GameManagerComponent } from '../game-manager/game-manager';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-chessboard',
  standalone: true,
  imports: [CommonModule, MoveHistoryComponent, EvaluationComponent, EvaluationBarComponent, OpeningComponent, GameManagerComponent],
  templateUrl: './chessboard.html',
  styleUrl: './chessboard.css'
})
export class ChessboardComponent implements AfterViewInit {
  @ViewChild(GameManagerComponent) gameManager!: GameManagerComponent;
  private board: any;

  private moveSound = new Audio('assets/sounds/move.mp3');
  private captureSound = new Audio('assets/sounds/capture.mp3');
  private undoSound = new Audio('assets/sounds/select.mp3');
  private miscSound = new Audio('assets/sounds/notify.mp3');

  constructor(
    private backendApiService: BackendApiService,
    private gameStateService: GameStateService,
  ) {}

  ngAfterViewInit() {
    this.board = new Chessboard(document.getElementById('myBoard')!, {
      sprite: {
        url: "/assets/pieces/standard.svg"
      },
      extensions: [
        {
          class: PromotionDialog
        }
      ]
    });

    setTimeout(() => {
      this.board.setPosition(this.gameStateService.getFen());
      this.board.enableMoveInput(this.inputHandler.bind(this));
      this.updateEvaluation();
    }, 100);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        const undone = this.gameStateService.undoMove();
        if (undone) {
          this.undoSound.currentTime = 0;
          this.undoSound.play();
          this.board.setPosition(this.gameStateService.getFen());
          this.updateEvaluation();
        }
      }
    });
  }

  inputHandler(event: any) {
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
      const moves = this.gameStateService.getGame().moves({ square: event.square, verbose: true });
      return moves.length > 0;
    }
    else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
      // Check if promotion
      const piece = this.gameStateService.getGame().get(event.squareFrom);
      const isPromotion = piece && piece.type === 'p' &&
        ((piece.color === 'w' && event.squareTo[1] === '8') ||
         (piece.color === 'b' && event.squareTo[1] === '1'));

      if (isPromotion) {
        event.chessboard.showPromotionDialog(event.squareTo, piece.color, (result: any) => {
          if (result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected) {
            const promoPiece = result.piece.charAt(1);
            const move = this.gameStateService.makeMove(event.squareFrom, event.squareTo, promoPiece);

            if (move) {
              if (move.captured) {
                this.captureSound.play();
              } else {
                this.moveSound.play();
              }
              this.updateEvaluation();
            }

            this.board.setPosition(this.gameStateService.getFen());
          } else {
            this.board.setPosition(this.gameStateService.getFen());
          }
        });
        return true;
      }

      // Regular move - validate and play sound if legal
      const move = this.gameStateService.makeMove(event.squareFrom, event.squareTo);
      if (move) {
        if (move.captured) {
          this.captureSound.play();
        } else {
          this.moveSound.play();
        }
        this.updateEvaluation();
      }
      return move !== null;
    }
    else if (event.type === INPUT_EVENT_TYPE.moveInputFinished) {
      this.board.setPosition(this.gameStateService.getFen());   // force update board (handle castling)
    }

    return true;
  }

  updateEvaluation() {
    this.backendApiService.getEvaluation(this.gameStateService.getFen()).subscribe({
      next: (response: EvaluationResponse) => {
        this.gameStateService.updateEvaluation(this.formatEvaluation(response), response.score);
      },
      error: (err: any) => {
        console.error('Error calling API:', err);
        this.gameStateService.updateEvaluation('Error', 0);
      }
    });
  }

  private formatEvaluation(response: EvaluationResponse): string {
    if (response.mateIn !== null) {
      if (response.mateIn === 0) {
        return response.score > 0 ? '1-0' : '0-1';   // checkmate on the board
      }
      return `#${response.mateIn}`;
    }
    return response.score > 0
      ? `+${response.score.toFixed(2)}`
      : response.score.toFixed(2);
  }

  resetBoard() {
    this.undoSound.play();
    this.gameStateService.resetGame();
    this.board.setPosition(this.gameStateService.getFen());
    this.updateEvaluation();
  }

  openGameManager() {
    this.gameManager.open();
  }

  onGameLoaded() {
    this.board.setPosition(this.gameStateService.getFen());
    this.updateEvaluation();
    this.miscSound.play();
  }
}
