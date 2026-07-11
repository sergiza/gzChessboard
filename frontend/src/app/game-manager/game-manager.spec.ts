import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameManagerComponent } from './game-manager';

describe('GameManagerComponent', () => {
  let component: GameManagerComponent;
  let fixture: ComponentFixture<GameManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameManagerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
