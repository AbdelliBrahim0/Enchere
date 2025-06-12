import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnchereDetailles } from './enchere-detailles';

describe('EnchereDetailles', () => {
  let component: EnchereDetailles;
  let fixture: ComponentFixture<EnchereDetailles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnchereDetailles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnchereDetailles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
