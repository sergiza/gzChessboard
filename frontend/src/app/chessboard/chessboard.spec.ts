import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessboardComponent } from './chessboard';

describe('ChessboardComponent', () => {
  let component: ChessboardComponent;
  let fixture: ComponentFixture<ChessboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChessboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChessboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
