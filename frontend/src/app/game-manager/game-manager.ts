import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendApiService, Folder, SavedGame } from '../services/backend-api';
import { GameStateService } from '../services/game-state';

@Component({
  selector: 'app-game-manager',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './game-manager.html',
  styleUrl: './game-manager.css'
})
export class GameManagerComponent {
  @Output() close = new EventEmitter<void>();
  @Output() gameLoaded = new EventEmitter<void>();

  private api = inject(BackendApiService);
  private gameState = inject(GameStateService);

  isOpen = signal(false);
  error = signal('');

  folders = signal<Folder[]>([]);
  selectedFolder = signal<Folder | null>(null);
  games = signal<SavedGame[]>([]);

  newFolderName = '';
  newGameName = '';

  open() {
    this.isOpen.set(true);
    this.error.set('');
    this.loadFolders();
  }

  closeModal() {
    this.isOpen.set(false);
    this.selectedFolder.set(null);
    this.close.emit();
  }

  loadFolders() {
    this.api.getFolders().subscribe({
      next: folders => this.folders.set(folders),
      error: () => this.error.set('Could not load folders')
    });
  }

  createFolder() {
    const name = this.newFolderName.trim();
    if (!name) return;

    this.api.createFolder(name).subscribe({
      next: () => {
        this.newFolderName = '';
        this.error.set('');
        this.loadFolders();
      },
      error: err => {
        this.error.set(err.status === 409
          ? `A folder named "${name}" already exists`
          : 'Could not create folder');
      }
    });
  }

  deleteFolder(folder: Folder) {
    if (!confirm(`Delete folder "${folder.name}" and all ${folder.gameCount} games inside?`)) return;

    this.api.deleteFolder(folder.id).subscribe({
      next: () => this.loadFolders(),
      error: () => this.error.set('Could not delete folder')
    });
  }

  selectFolder(folder: Folder) {
    this.selectedFolder.set(folder);
    this.error.set('');
    this.loadGames(folder.id);
  }

  backToFolders() {
    this.selectedFolder.set(null);
    this.games.set([]);
    this.error.set('');
    this.loadFolders();
  }

  loadGames(folderId: number) {
    this.api.getGamesInFolder(folderId).subscribe({
      next: games => this.games.set(games),
      error: () => this.error.set('Could not load games')
    });
  }

  saveGame() {
    const folder = this.selectedFolder();
    if (!folder) return;

    const name = this.newGameName.trim() || `Game ${new Date().toLocaleString()}`;

    this.api.saveGame(name, this.gameState.getPgn(), folder.id).subscribe({
      next: () => {
        this.newGameName = '';
        this.error.set('');
        this.loadGames(folder.id);
      },
      error: () => this.error.set('Could not save game')
    });
  }

  loadGame(game: SavedGame) {
    if (!this.gameState.loadPgn(game.pgn)) {
      this.error.set(`Could not load "${game.name}": invalid PGN`);
      return;
    }
    this.gameLoaded.emit();
    this.closeModal();
  }

  deleteGame(game: SavedGame) {
    if (!confirm(`Delete "${game.name}"?`)) return;

    this.api.deleteGame(game.id).subscribe({
      next: () => this.loadGames(this.selectedFolder()!.id),
      error: () => this.error.set('Could not delete game')
    });
  }
}
