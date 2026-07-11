import { Component } from '@angular/core';
import { ChessboardComponent } from './chessboard/chessboard';
import { provideHttpClient } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [ChessboardComponent, NavbarComponent],
  templateUrl: './app.html'
})
export class App {
  title = 'gzChessboard';
}
