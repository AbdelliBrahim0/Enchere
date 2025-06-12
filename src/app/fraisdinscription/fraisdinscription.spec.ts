import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fraisdinscription } from './fraisdinscription';

describe('Fraisdinscription', () => {
  let component: Fraisdinscription;
  let fixture: ComponentFixture<Fraisdinscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fraisdinscription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fraisdinscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
