import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireDeParticipation } from './formulaire-de-participation';

describe('FormulaireDeParticipation', () => {
  let component: FormulaireDeParticipation;
  let fixture: ComponentFixture<FormulaireDeParticipation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireDeParticipation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireDeParticipation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
