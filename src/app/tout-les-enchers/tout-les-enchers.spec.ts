import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToutLesEnchers } from './tout-les-enchers';

describe('ToutLesEnchers', () => {
  let component: ToutLesEnchers;
  let fixture: ComponentFixture<ToutLesEnchers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToutLesEnchers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToutLesEnchers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
