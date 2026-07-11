import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationBarComponent } from './evaluation-bar';

describe('EvaluationBarComponent', () => {
  let component: EvaluationBarComponent;
  let fixture: ComponentFixture<EvaluationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationBarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
