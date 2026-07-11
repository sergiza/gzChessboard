import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api';

export interface EvaluationResponse {
  score: number;
  mateIn: number | null;
  analysis: string;
}

export interface Folder {
  id: number;
  name: string;
  gameCount: number;
}

export interface SavedGame {
  id: number;
  name: string;
  pgn: string;
  folderId: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {

  constructor(private http: HttpClient) { }

  getEvaluation(fen: string): Observable<EvaluationResponse> {
    return this.http.post<EvaluationResponse>(`${API_URL}/chess/evaluate`, { fen });
  }

  getOpening(moves: string[]): Observable<any> {
    const movesString = moves.join(' ');
    return this.http.get(`${API_URL}/chess/opening`, {
      params: { moves: movesString }
    });
  }

  // Folders
  getFolders(): Observable<Folder[]> {
    return this.http.get<Folder[]>(`${API_URL}/folders`);
  }

  createFolder(name: string): Observable<Folder> {
    return this.http.post<Folder>(`${API_URL}/folders`, { name });
  }

  deleteFolder(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/folders/${id}`);
  }

  // Games
  getGamesInFolder(folderId: number): Observable<SavedGame[]> {
    return this.http.get<SavedGame[]>(`${API_URL}/folders/${folderId}/games`);
  }

  saveGame(name: string, pgn: string, folderId: number): Observable<SavedGame> {
    return this.http.post<SavedGame>(`${API_URL}/games`, { name, pgn, folderId });
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/games/${id}`);
  }
}
