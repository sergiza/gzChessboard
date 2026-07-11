import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationComponent } from './evaluation';

describe('EvaluationComponent', () => {
  let component: EvaluationComponent;
  let fixture: ComponentFixture<EvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
