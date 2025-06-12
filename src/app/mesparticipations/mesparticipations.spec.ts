import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mesparticipations } from './mesparticipations';

describe('Mesparticipations', () => {
  let component: Mesparticipations;
  let fixture: ComponentFixture<Mesparticipations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mesparticipations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mesparticipations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
